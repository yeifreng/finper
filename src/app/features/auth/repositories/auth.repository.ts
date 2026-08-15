import { Injectable } from '@angular/core';
import { AuthFormInterface } from '../interfaces/auth-form.interface';
import { supabase } from '../../../core/providers/supabase.provider';

@Injectable({
  providedIn: 'root',
})
export class AuthRepository {

  async register(data: AuthFormInterface){
    console.log('datos desde repository:', data);

    // Crear el usuario en Supabase Auth
    const { data: authData, error } = await supabase.auth.signUp({

      email: data.email,

      password: data.password!

    });

    // Manejar errores de registro
    if (error) {
      throw error;
    }

    // Obtener el usuario creado
    const user = authData.user;

    if (!user) {
      throw new Error('No fue posible crear el usuario.');
    }

    // Crear el perfil del usuario
    const { error: profileError } = await supabase
      .from('users')
      .insert({

        id: user.id,

        first_name: data.firstName,

        last_name: data.lastName,

        email: data.email

    });

    // Manejar errores de creación de perfil
    if (profileError) {
      throw profileError;
    }

    // Retornar el usuario creado
    return user;
  }


  async login(data: AuthFormInterface) {

      const { data: authData, error } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password!,
        });

      if (error) {
        throw error;
      }

      console.log('Sesión:', authData.session);

      const user = authData.user;

      if (!user) {
        throw new Error('No fue posible iniciar sesión.');
      }

      return {
        user,
        session: authData.session,
      };

  }

  async getSession() {

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return data.session;
  }

    async logout(): Promise<void> {

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

  }
}
