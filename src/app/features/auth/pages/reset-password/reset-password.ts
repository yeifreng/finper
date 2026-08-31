import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormUtils } from '../../../../shared/utils/form-utils';
import { Router, RouterLink } from '@angular/router';
import { AuthstateService } from '../../../../core/services/authstate-service';
import { AuthService } from '../../services/auth-service';
import { NotificationService } from '../../../../core/services/notification-service';
import { LoadingService } from '../../../../core/services/loading-service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export default class ResetPassword  {


   //Mostrar u ocultar la contraseña y la confirmacion de la contraseña
    showPassword = false;
    showConfirmPassword = false;

    togglePassword(): void {
      this.showPassword = !this.showPassword;
    }

    toggleConfirmPassword(): void {
      this.showConfirmPassword = !this.showConfirmPassword;
    }

  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthstateService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly loadingService = inject(LoadingService);


  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {

    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      return { passwordsMismatch: true };
    }

    return null;
  }

  formUtils = FormUtils;

  private readonly fb = inject(FormBuilder);

  readonly resetForm = this.fb.nonNullable.group(
    {
      newPassword: ['', [Validators.required,Validators.minLength(8), Validators.pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)]],
      confirmPassword: ['', [Validators.required,Validators.minLength(8), Validators.pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)]],
    },
    {
      validators: this.passwordsMatchValidator.bind(this),
    }
  );

  async onSubmit(): Promise<void> {

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const { newPassword } = this.resetForm.getRawValue();

    this.loadingService.show();

    try {

      await this.authService.resetPassword(newPassword);

      this.authState.clearPasswordRecovery();

      await this.authService.logout();

      this.notificationService.success('Contraseña actualizada correctamente.');

      await this.router.navigate(['/auth/login']);

    } catch (error: unknown) {

      console.log(error);

      if (error instanceof Error) {
        this.notificationService.error(error.message);
      } else {
        this.notificationService.error(
          'No fue posible cambiar la contraseña.'
        );
      }

    } finally{
      this.loadingService.hide();
    }

  }
}
