import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormUtils } from '../../../../shared/utils/form-utils';
import { Router } from '@angular/router';
import { AuthstateService } from '../../../../core/services/authstate-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export default class ResetPassword  {

  private readonly authService = inject(AuthService);
private readonly authState = inject(AuthstateService);
private readonly router = inject(Router);


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
      newPassword: ['', [Validators.required,Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required,Validators.minLength(8)]],
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

    try {

      await this.authService.resetPassword(newPassword);

      this.authState.clearPasswordRecovery();

      await this.authService.logout();

      alert('Contraseña actualizada correctamente.');

      await this.router.navigate(['/auth/login']);

    } catch (error: any) {

      console.error('Error al cambiar la contraseña:', error);

      alert(
        error?.message ||
        'No fue posible cambiar la contraseña.'
      );

    }

  }
}
