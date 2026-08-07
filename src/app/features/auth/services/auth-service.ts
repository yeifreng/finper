import { inject, Injectable } from '@angular/core';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthFormInterface } from '../interfaces/auth-form.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly repository = inject(AuthRepository);

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

}
