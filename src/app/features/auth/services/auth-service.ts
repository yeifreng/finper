import { inject, Injectable } from '@angular/core';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthFormInterface } from '../interfaces/auth-form.interface';
import { supabase } from '../../../core/providers/supabase.provider';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly repository = inject(AuthRepository);


  //Registrar un nuevo usuario
  register(data: AuthFormInterface){

    if (data.password !== data.confirmPassword) {
    throw new Error('Las contraseñas no coinciden.');
    }

    return this.repository.register({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });
  }


  async login(data: AuthFormInterface) {


      try {

        return await this.repository.login({
          email: data.email,
          password: data.password!,
        });

      } catch (error) {

        console.log('ERROR EN AUTHSERVICE:', error);

        if (error instanceof Error) {
          throw new Error('Correo o contraseña incorrectos.');
        }

        throw error;
      }
  }

  async logout(): Promise<void> {

    await this.repository.logout();

  }

}
