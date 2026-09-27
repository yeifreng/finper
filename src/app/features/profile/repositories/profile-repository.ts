import { Injectable } from '@angular/core';
import { ProfileInterface } from '../interfaces/ProfileInterface.interface';
import { supabase } from '../../../core/providers/supabase.provider';

@Injectable({
  providedIn: 'root',
})
export class ProfileRepository {
   async getProfile(): Promise<ProfileInterface> {

    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      throw new Error('No hay una sesión activa.');
    }

    const { data, error } = await supabase
      .from('users')
      .select('first_name,last_name,email')
      .eq('id', auth.user.id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
    throw new Error('No se encontró tu perfil.');
  }

  return {
    firstName: data.first_name ?? '',
    lastName: data.last_name ?? '',
    email: data.email ?? '',
  };

  }

  async updateProfile(profile: ProfileInterface): Promise<void> {

    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      throw new Error('No hay una sesión activa.');
    }

    const { error } = await supabase
      .from('users')
      .update({
        first_name: profile.firstName,
        last_name: profile.lastName,
      })
      .eq('id', auth.user.id);

    if (error) throw error;

  }

  async changePassword(password: string): Promise<void> {

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;

  }

}
