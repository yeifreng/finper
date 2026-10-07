import { inject, Injectable } from '@angular/core';
import { ExpenseRepository } from '../repositories/expense-repository';
import { MovementInterface, MovementPayload } from '../../../shared/interfaces/movement.interface';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {

  private readonly repository = inject(ExpenseRepository);

  getAll(): Promise<MovementInterface[]> {
    return this.repository.getAll();
  }

  create(payload: MovementPayload): Promise<MovementInterface> {
    return this.repository.create(payload);
  }

  update(id: string, payload: MovementPayload): Promise<MovementInterface> {
    return this.repository.update(id, payload);
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

}
