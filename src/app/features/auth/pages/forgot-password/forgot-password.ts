import { Component, inject } from '@angular/core';
import AuthForm from '../../components/auth-form/auth-form';
import { AuthFormInterface } from '../../interfaces/auth-form.interface';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [AuthForm],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export default class ForgotPassword {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  async forgotPassword(data: AuthFormInterface): Promise<void> {

      try {

        await this.authService.forgotPassword(data);

        alert(
          'Si el correo está registrado, recibirás un enlace para recuperar tu contraseña.'
        );
        await this.router.navigate(['/auth/login']);

      } catch (error) {

        console.error(error);

        if (error instanceof Error) {
          alert(error.message);
        }

      }

  }

}
