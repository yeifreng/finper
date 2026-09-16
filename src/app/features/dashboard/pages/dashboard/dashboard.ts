import { Component, HostListener, inject, signal } from '@angular/core';
import { AuthService } from '../../../auth/services/auth-service';
import { Router } from '@angular/router';
import { Menu } from "../../../../shared/components/menu/menu";
import { Sidebar } from "../../../../shared/components/sidebar/sidebar";
import { Footer } from "../../../../shared/components/footer/footer";
import { Card } from "../../components/card/card";
import { Chart } from "../../components/chart/chart";
import { CategoryList } from "../../components/category-list/category-list";
import { Movements } from "../../components/movements/movements";

@Component({
  selector: 'app-dashboard',
  imports: [Menu, Sidebar, Footer, Card, Chart, CategoryList, Movements],
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

  isSidebarOpen = signal(window.innerWidth >= 1024);

  toggleSidebar(): void {
    this.isSidebarOpen.update((isOpen) => !isOpen);
  }

  @HostListener('window:resize')
    onResize(): void {
    this.isSidebarOpen.set(window.innerWidth >= 1024);
  }

}
