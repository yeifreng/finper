import { Injectable, signal } from '@angular/core';
import { NotificationType, Notification } from '../../shared/interfaces/notification.interface';


@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private readonly notification = signal<Notification | null>(null);

  readonly currentNotification = this.notification.asReadonly();

  private timeoutId?: ReturnType<typeof setTimeout>;

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  warning(message: string): void {
    this.show('warning', message);
  }

  info(message: string): void {
    this.show('info', message);
  }

  hide(): void {
    this.notification.set(null);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private show(type: NotificationType, message: string): void {

    this.notification.set({
      type,
      message,
    });

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.hide();
    }, 3000);
  }

}
