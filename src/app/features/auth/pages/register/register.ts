import { Component, inject } from '@angular/core';
import AuthForm from '../../components/auth-form/auth-form';
import { AuthFormInterface } from '../../interfaces/auth-form.interface';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-register',
  imports: [AuthForm],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export default class Register {

  private readonly authService = inject(AuthService);


   async register(data: AuthFormInterface){
   try {

     const user = await this.authService.register(data);

     console.log(user);

     alert('Usuario registrado correctamente.');

   } catch (error) {

     console.error(error);

     if (error instanceof Error) {
       alert(error.message);
     }

   }
 }

}
