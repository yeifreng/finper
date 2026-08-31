import { Component, inject } from '@angular/core';
import AuthForm from "../../components/auth-form/auth-form";
import { AuthService } from '../../services/auth-service';
import { AuthFormInterface } from '../../interfaces/auth-form.interface';
import { AuthstateService } from '../../../../core/services/authstate-service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification-service';
import { LoadingService } from '../../../../core/services/loading-service';

@Component({
  selector: 'app-login',
  imports: [AuthForm],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export default class Login {

   private readonly authService = inject(AuthService);
   private readonly authState = inject(AuthstateService);
   private readonly router = inject(Router);
   private readonly notificationService = inject(NotificationService);
   private readonly loadingService = inject(LoadingService);

   async login(data: AuthFormInterface) {

    this.loadingService.show();

      try {

         const result = await this.authService.login(data);
         this.authState.setUser(result.user);

         this.notificationService.success('Inicio de sesión exitoso.');
         await this.router.navigate(['/dashboard']);

      } catch (error) {

        if (error instanceof Error) {
          this.notificationService.error(error.message);
        }

      } finally {

          this.loadingService.hide();

      }
   }

}
