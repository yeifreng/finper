import { Component, HostListener, inject, output, signal, OnInit, input } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { ProfileInterface } from '../../../features/profile/interfaces/ProfileInterface.interface';
import { ProfileService } from '../../../features/profile/services/profile-service';
import { NotificationService } from '../../../core/services/notification-service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly profileService = inject(ProfileService);
  private readonly notificationService = inject(NotificationService);

  readonly title = input<string>('Dashboard');

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

  readonly profile = signal<ProfileInterface>({
    firstName: '',
    lastName: '',
    email: '',
  });

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }

  async loadProfile(): Promise<void> {
    try {
      const profile = await this.profileService.getProfile();
      this.profile.set(profile);
    } catch (error) {
      this.notificationService.error((error as Error).message);
    }
  }

    // Helpers para el template
  get displayName(): string {
    const { firstName, lastName } = this.profile();
    const full = `${firstName} ${lastName}`.trim();
    return full || 'Usuario';
  }

  get initial(): string {
    const { firstName } = this.profile();
    return firstName?.charAt(0).toUpperCase() || 'U';
  }


}
