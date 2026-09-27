import { inject, Injectable } from '@angular/core';
import { ProfileRepository } from '../repositories/profile-repository';
import { ProfileInterface } from '../interfaces/ProfileInterface.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

   private readonly repository = inject(ProfileRepository);

  getProfile(): Promise<ProfileInterface> {
    return this.repository.getProfile();
  }

  async updateProfile(profile: ProfileInterface): Promise<void> {

    if (!profile.firstName?.trim()) {
      throw new Error('El nombre es obligatorio.');
    }

    if (!profile.lastName?.trim()) {
      throw new Error('El apellido es obligatorio.');
    }

    await this.repository.updateProfile(profile);

  }

  async changePassword(profile: ProfileInterface): Promise<void> {

    if (!profile.password) {
      throw new Error('Debes ingresar una contraseña.');
    }

    if (profile.password.length < 8) {
      throw new Error('La contraseña debe tener mínimo 8 caracteres.');
    }

    if (profile.password !== profile.confirmPassword) {
      throw new Error('Las contraseñas no coinciden.');
    }

    await this.repository.changePassword(profile.password);

  }

}
