import { inject, Injectable } from '@angular/core';
import { MovementInterface, MovementPayload } from '../../../shared/interfaces/movement.interface';
import { IncomeRepository } from '../repositories/income-repository';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {

  private readonly repository = inject(IncomeRepository);

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
