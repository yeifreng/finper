import { Component, effect, inject, input, output } from '@angular/core';
import { ProfileService } from '../../services/profile-service';
import { NotificationService } from '../../../../core/services/notification-service';
import { LoadingService } from '../../../../core/services/loading-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileInterface } from '../../interfaces/ProfileInterface.interface';
import { FormUtils } from '../../../../shared/utils/form-utils';

@Component({
  selector: 'app-profile-form',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.css',
})
export class ProfileForm {

  formUtils = FormUtils;

  //Mostrar u ocultar la contraseña y la confirmacion de la contraseña
  showPassword = false;
  showConfirmPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


  private readonly profileService = inject(ProfileService);
  private readonly notificationService = inject(NotificationService);
  private readonly loadingService = inject(LoadingService);
  private readonly formBuilder = inject(FormBuilder);

  readonly profile = input.required<ProfileInterface>();
  readonly activeSection = input.required<'profile' | 'security'>();

  readonly profileSaved = output<ProfileInterface>();

  readonly profileForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: [{ value: '', disabled: true }],
  });

  readonly passwordForm = this.formBuilder.group({
    password: ['', [Validators.required,Validators.minLength(8), Validators.pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)]],
    confirmPassword: ['',[Validators.required,Validators.minLength(8), Validators.pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)]],
  });

  constructor() {
    // Cada vez que el input `profile` cambie, sincroniza el formulario
    effect(() => {
      const p = this.profile();
      this.profileForm.patchValue({
        firstName: p.firstName ?? '',
        lastName: p.lastName ?? '',
        email: p.email ?? '',
      });
    });
  }

  async saveProfile(): Promise<void> {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.loadingService.show();

    try {
      const data: ProfileInterface = {
        ...this.profile(),
        firstName: this.profileForm.value.firstName ?? '',
        lastName: this.profileForm.value.lastName ?? '',
      };

      await this.profileService.updateProfile(data);
      this.profileSaved.emit(data);
      this.notificationService.success('Perfil actualizado correctamente.');

    } catch (error) {
      this.notificationService.error((error as Error).message);
    } finally {
      this.loadingService.hide();
    }
  }

  async savePassword(): Promise<void> {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.loadingService.show();

    try {
      await this.profileService.changePassword({
        ...this.profile(),
        password: this.passwordForm.value.password ?? '',
        confirmPassword: this.passwordForm.value.confirmPassword ?? '',
      });

      this.passwordForm.reset();
      this.notificationService.success('Contraseña actualizada correctamente.');

    } catch (error) {
      this.notificationService.error((error as Error).message);
    } finally {
      this.loadingService.hide();
    }
  }
}

