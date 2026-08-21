import { Component, inject } from '@angular/core';
import AuthForm from "../../components/auth-form/auth-form";
import { AuthService } from '../../services/auth-service';
import { AuthFormInterface } from '../../interfaces/auth-form.interface';
import { AuthstateService } from '../../../../core/services/authstate-service';
import { Router } from '@angular/router';

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

   async login(data: AuthFormInterface) {

       try {

         const result = await this.authService.login(data);
         this.authState.setUser(result.user);

         alert('Inicio de sesión exitoso.');
         this.router.navigate(['/dashboard']);

       } catch (error) {

         console.error(error);

         if (error instanceof Error) {
           alert(error.message);
         }

       }
   }

}
