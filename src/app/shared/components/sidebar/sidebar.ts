import { Component, HostListener, inject, input, signal } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSidebarOpen = input(false);

  async logout(): Promise<void> {

    await this.authService.logout();

    await this.router.navigate(['/auth/login']);

  }


}
