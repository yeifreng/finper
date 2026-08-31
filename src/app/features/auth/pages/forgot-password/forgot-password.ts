import { Component, inject } from '@angular/core';
import AuthForm from '../../components/auth-form/auth-form';
import { AuthFormInterface } from '../../interfaces/auth-form.interface';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification-service';
import { LoadingService } from '../../../../core/services/loading-service';

@Component({
  selector: 'app-forgot-password',
  imports: [AuthForm],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export default class ForgotPassword {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly loadingService = inject(LoadingService);

  async forgotPassword(data: AuthFormInterface): Promise<void> {

    this.loadingService.show();

      try {

        await this.authService.forgotPassword(data);

        this.notificationService.success('Si el correo está registrado, recibirás un enlace para recuperar tu contraseña.');
        await this.router.navigate(['/auth/login']);

      } catch (error) {

        if (error instanceof Error) {
          this.notificationService.error(error.message);
        }

      } finally {

        this.loadingService.hide();

      }

  }

}
