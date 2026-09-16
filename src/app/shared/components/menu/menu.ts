import { Component, HostListener, inject, output, signal } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly toggleSidebar = output<void>();

  async logout(): Promise<void> {

    await this.authService.logout();

    await this.router.navigate(['/auth/login']);

  }

  isSidebarOpen = signal(window.innerWidth >= 1024);
  isUserMenuOpen = signal(false);

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update((isOpen) => !isOpen);
  }

}
