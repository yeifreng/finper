import { inject, Injectable, signal } from '@angular/core';
import { AuthRepository } from '../../features/auth/repositories/auth.repository';
import { supabase } from '../providers/supabase.provider';

@Injectable({
  providedIn: 'root',
})
export class AuthstateService {

  private readonly authRepository = inject(AuthRepository);
  private readonly _user = signal<any>(null);

  readonly user = this._user.asReadonly();

  private readonly _isPasswordRecovery = signal(false);

  readonly isPasswordRecovery = this._isPasswordRecovery.asReadonly();

  private restorePasswordRecoveryState(): void {

    const recovery = localStorage.getItem('passwordRecovery');

    if (recovery === 'true') {
      this._isPasswordRecovery.set(true);
    }

  }

  clearPasswordRecovery(): void {

    this._isPasswordRecovery.set(false);

    localStorage.removeItem('passwordRecovery');

  }

  setUser(user: any): void {
    this._user.set(user);
  }

  clearUser(): void {
    this._user.set(null);
  }

  // Método para inicializar el estado de autenticación al recargar la aplicación
  async initialize(): Promise<void> {

    this.restorePasswordRecoveryState();

    const session = await this.authRepository.getSession();

    if (session?.user) {
      this.setUser(session.user);
    } else {
      this.clearUser();
    }

}

// Método para escuchar los cambios en el estado de autenticación
listenToAuthChanges(): void {

  supabase.auth.onAuthStateChange((event, session) => {


    if (event === 'PASSWORD_RECOVERY') {
      this._isPasswordRecovery.set(true);
      localStorage.setItem('passwordRecovery', 'true');
    }

    if (session?.user) {
      this.setUser(session.user);
    } else {
      this.clearUser();
    }

  });

}


}
