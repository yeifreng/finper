import { Component, computed, input, output, signal } from '@angular/core';
import { CategoryInterface } from '../../interfaces/category.interface';

@Component({
  selector: 'app-category-list',
  imports: [],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {

  readonly categories = input.required<CategoryInterface[]>();

  readonly edit = output<CategoryInterface>();
  readonly delete = output<CategoryInterface>();

  readonly filterType = signal<'all' | 'ingreso' | 'gasto'>('all');

  readonly totalCount = computed(() => this.categories().length);

  readonly ingresoCount = computed(
    () => this.categories().filter((c) => c.type === 'ingreso').length
  );

  readonly gastoCount = computed(
    () => this.categories().filter((c) => c.type === 'gasto').length
  );

  readonly filteredCategories = computed(() => {
    const filter = this.filterType();
    const list = this.categories();

    if (filter === 'all') return list;

    return list.filter((category) => category.type === filter);
  });

  onFilterChange(type: 'all' | 'ingreso' | 'gasto'): void {
    this.filterType.set(type);
  }

  onEdit(category: CategoryInterface): void {
    if (category.isDefault) return;
    this.edit.emit(category);
  }

  onDelete(category: CategoryInterface): void {
    if (category.isDefault) return;
    this.delete.emit(category);
  }

}
