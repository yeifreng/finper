import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export default class Dashboard {

    private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  async logout(): Promise<void> {

    await this.authService.logout();

    await this.router.navigate(['/auth/login']);

  }

}
