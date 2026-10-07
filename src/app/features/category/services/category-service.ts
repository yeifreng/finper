import { inject, Injectable } from '@angular/core';
import { CategoryRepository } from '../repositories/category-repository';
import { CategoryInterface, CategoryPayload } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  private readonly repository = inject(CategoryRepository);

  getAll(): Promise<CategoryInterface[]>{
    return this.repository.getAll();
  }

  getByType(type: 'ingreso' | 'gasto'): Promise<CategoryInterface[]> {
    return this.repository.getByType(type);
  }

  create(payload: CategoryPayload): Promise<CategoryInterface> {
    return this.repository.create(payload);
  }

  update(id: string, payload: CategoryPayload): Promise<CategoryInterface> {
    return this.repository.update(id, payload);
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

}
