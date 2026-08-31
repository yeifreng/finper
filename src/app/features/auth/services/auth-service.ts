import { inject, Injectable } from '@angular/core';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthFormInterface } from '../interfaces/auth-form.interface';
import { isAuthApiError } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly repository = inject(AuthRepository);


  //Registrar un nuevo usuario
  async register(data: AuthFormInterface){

    if (data.password !== data.confirmPassword) {
    throw new Error('Las contraseñas no coinciden.');
    }

    try {

      return await this.repository.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

    } catch (error: unknown) {

        if (isAuthApiError(error)) {

          if (error.code === 'user_already_exists') {
            throw new Error(
              'Este correo electrónico ya está registrado.'
            );
          }

        }

      if (error instanceof Error && error.message === 'Failed to fetch') {
        throw new Error(
          'No fue posible conectar con el servidor. Verifica tu conexión a Internet e inténtalo nuevamente.'
        );
      }

      throw new Error(
        'Ocurrió un error al registrar el usuario.'
      );

    }
  }


  async login(data: AuthFormInterface) {

      try {

        return await this.repository.login({
          email: data.email,
          password: data.password!,
        });

      } catch (error: unknown) {

        if (isAuthApiError(error)) {
          if (error.code === 'invalid_credentials') {
            throw new Error('Correo o contraseña incorrectos.');
          }
        }

        if (error instanceof Error && error.message === 'Failed to fetch') {
          throw new Error(
            'No fue posible conectar con el servidor. Verifica tu conexión a Internet e inténtalo nuevamente.'
          );
        }

        throw new Error('Ocurrió un error al iniciar sesión.');
      }
  }

  async forgotPassword(data: AuthFormInterface): Promise<void> {

    try {

      await this.repository.forgotPassword({
        email: data.email,
      });

    } catch (error: unknown) {

      if (isAuthApiError(error)) {

        if (error.code === 'email_address_invalid') {
          throw new Error('El correo electrónico no tiene un dominio válido.');
        }

      }

      if (error instanceof Error && error.message === 'Failed to fetch') {
        throw new Error(
          'No fue posible conectar con el servidor. Verifica tu conexión a Internet.'
        );
      }

      throw new Error('Ocurrió un error al enviar el correo de recuperación.');
    }

  }

  async logout(): Promise<void> {

    await this.repository.logout();

  }

  async resetPassword(newPassword: string): Promise<void> {

    try {

      await this.repository.resetPassword(newPassword);

    } catch (error: unknown) {

       if (isAuthApiError(error)) {

        if (error.code === 'same_password') {
          throw new Error(
            'La nueva contraseña debe ser diferente a la anterior.'
          );
        }

      }

      if (error instanceof Error) {

        if (error.message === 'Auth session missing!') {
          throw new Error(
            'La sesión de recuperación no es válida o ha expirado.'
          );
        }

      }

      if (
        error instanceof Error &&
        error.message === 'Failed to fetch'
      ) {
        throw new Error(
          'No fue posible conectar con el servidor. Verifica tu conexión a Internet.'
        );
      }

      throw new Error(
        'No fue posible cambiar la contraseña.'
      );

    }


  }

}
