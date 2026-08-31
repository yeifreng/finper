import { Component, inject } from '@angular/core';
import AuthForm from '../../components/auth-form/auth-form';
import { AuthFormInterface } from '../../interfaces/auth-form.interface';
import { AuthService } from '../../services/auth-service';
import { NotificationService } from '../../../../core/services/notification-service';
import { Router } from '@angular/router';
import { LoadingService } from '../../../../core/services/loading-service';

@Component({
  selector: 'app-register',
  imports: [AuthForm],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export default class Register {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly loadingService = inject(LoadingService);


   async register(data: AuthFormInterface){

    this.loadingService.show();

    try {

     const user = await this.authService.register(data);

      this.notificationService.success('Usuario registrado correctamente.');
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
