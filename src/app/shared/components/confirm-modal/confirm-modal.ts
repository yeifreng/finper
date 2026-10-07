import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css',
})
export class ConfirmModal {

  readonly isOpen = input.required<boolean>();

  readonly title = input<string>('¿Estás seguro?');
  readonly message = input<string>('Esta acción no se puede deshacer.');
  readonly confirmText = input<string>('Confirmar');
  readonly cancelText = input<string>('Cancelar');

  /** 'danger' = rojo (eliminar), 'primary' = azul (acciones normales) */
  readonly variant = input<'danger' | 'primary'>('danger');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

}
