import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthstateService } from './core/services/authstate-service';
import { Notification } from "./shared/components/notification/notification";
import { Loading } from "./shared/components/loading/loading";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Notification, Loading],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private readonly authState = inject(AuthstateService);

  protected readonly title = signal('finanzas-personales');

  constructor() {
    this.authState.listenToAuthChanges();
  }
}
