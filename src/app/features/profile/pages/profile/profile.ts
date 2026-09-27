import { Component, HostListener, inject, signal } from '@angular/core';
import { Footer } from '../../../../shared/components/footer/footer';
import { AuthService } from '../../../auth/services/auth-service';
import { Router } from '@angular/router';
import { Sidebar } from '../../../../shared/components/sidebar/sidebar';
import { Menu } from '../../../../shared/components/menu/menu';
import { ProfileService } from '../../services/profile-service';
import { NotificationService } from '../../../../core/services/notification-service';
import { LoadingService } from '../../../../core/services/loading-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileInterface } from '../../interfaces/ProfileInterface.interface';
import { FormUtils } from '../../../../shared/utils/form-utils';
import { ProfileCard } from '../../components/profile-card/profile-card';
import { ProfileForm } from '../../components/profile-form/profile-form';

@Component({
  selector: 'app-profile',
  imports: [Footer, Sidebar, Menu, ReactiveFormsModule, ProfileCard, ProfileForm],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export default class Profile {


 private readonly profileService = inject(ProfileService);
  private readonly notificationService = inject(NotificationService);
  private readonly loadingService = inject(LoadingService);

  isSidebarOpen = signal(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  readonly activeSection = signal<'profile' | 'security'>('profile');

  readonly profile = signal<ProfileInterface>({
    firstName: '',
    lastName: '',
    email: '',
  });

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }

  async loadProfile(): Promise<void> {
    this.loadingService.show();
    try {
      const profile = await this.profileService.getProfile();
      this.profile.set(profile);
    } catch (error) {
      this.notificationService.error((error as Error).message);
    } finally {
      this.loadingService.hide();
    }
  }

  onSectionChange(section: 'profile' | 'security'): void {
    this.activeSection.set(section);
  }

  onProfileSaved(updated: ProfileInterface): void {
    this.profile.set(updated);
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update((isOpen) => !isOpen);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isSidebarOpen.set(window.innerWidth >= 1024);
  }
}


