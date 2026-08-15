import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthstateService } from './core/services/authstate-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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
