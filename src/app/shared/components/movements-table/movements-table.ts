import { Component, input, output } from '@angular/core';
import { MovementInterface } from '../../interfaces/movement.interface';

@Component({
  selector: 'app-movements-table',
  imports: [],
  templateUrl: './movements-table.html',
  styleUrl: './movements-table.css',
})
export class MovementsTable {

   readonly movements = input.required<MovementInterface[]>();

  readonly edit = output<MovementInterface>();
  readonly delete = output<MovementInterface>();

  onEdit(movement: MovementInterface): void {
    this.edit.emit(movement);
  }

  onDelete(movement: MovementInterface): void {
    this.delete.emit(movement);
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

}
