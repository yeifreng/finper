import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { IncomeService } from '../../services/income-service';
import { CategoryService } from '../../../category/services/category-service';
import { NotificationService } from '../../../../core/services/notification-service';
import { LoadingService } from '../../../../core/services/loading-service';
import { MovementInterface, MovementPayload } from '../../../../shared/interfaces/movement.interface';
import { CategoryInterface } from '../../../category/interfaces/category.interface';
import { Sidebar } from '../../../../shared/components/sidebar/sidebar';
import { Menu } from '../../../../shared/components/menu/menu';
import { MovementsTable } from '../../../../shared/components/movements-table/movements-table';
import { Footer } from '../../../../shared/components/footer/footer';
import { MovementsForm } from '../../../../shared/components/movements-form/movements-form';
import { ConfirmModal } from '../../../../shared/components/confirm-modal/confirm-modal';
import { MovementFilters } from '../../../../shared/interfaces/movement-filters.interface';
import { MovementsFilters } from '../../../../shared/components/movements-filters/movements-filters';

@Component({
  selector: 'app-income',
  imports: [Sidebar, Menu, MovementsTable, Footer, MovementsForm, ConfirmModal, MovementsFilters],
  templateUrl: './income.html',
  styleUrl: './income.css',
})
export default class Income {

   private readonly incomeService = inject(IncomeService);
  private readonly categoryService = inject(CategoryService);
  private readonly notificationService = inject(NotificationService);
  private readonly loadingService = inject(LoadingService);

  // ============ Sidebar ============
  isSidebarOpen = signal(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  toggleSidebar(): void {
    this.isSidebarOpen.update((isOpen) => !isOpen);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isSidebarOpen.set(window.innerWidth >= 1024);
  }

  // ============ Estado ============
  readonly movements = signal<MovementInterface[]>([]);
  readonly categories = signal<CategoryInterface[]>([]);
  readonly filters = signal<MovementFilters>({
    dateRange: 'all',
    dateFrom: '',
    dateTo: '',
    categoryId: 'all',
    search: '',
  });

  readonly filteredMovements = computed(() => {
    const f = this.filters();
    const list = this.movements();

    return list.filter((movement) => {
      // 1) Filtro por fecha
      if (f.dateFrom && movement.date < f.dateFrom) return false;
      if (f.dateTo && movement.date > f.dateTo) return false;

      // 2) Filtro por categoría
      if (f.categoryId !== 'all' && movement.categoryId !== f.categoryId) {
        return false;
      }

      // 3) Filtro por texto (descripción)
      if (f.search) {
        const search = f.search.toLowerCase();
        const description = (movement.description ?? '').toLowerCase();
        if (!description.includes(search)) return false;
      }

      return true;
    });
  });

  onFiltersChange(filters: MovementFilters): void {
    this.filters.set(filters);
  }

  readonly isCreateModalOpen = signal(false);
  readonly isEditModalOpen = signal(false);
  readonly movementToEdit = signal<MovementInterface | null>(null);

  readonly isDeleteModalOpen = signal(false);
  readonly movementToDelete = signal<MovementInterface | null>(null);

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.loadMovements(),
      this.loadCategories(),
    ]);
  }

  async loadMovements(): Promise<void> {
    this.loadingService.show();
    try {
      const list = await this.incomeService.getAll();
      this.movements.set(list);
    } catch (error) {
      this.notificationService.error((error as Error).message);
    } finally {
      this.loadingService.hide();
    }
  }

  async loadCategories(): Promise<void> {
    try {
      const list = await this.categoryService.getByType('ingreso');
      this.categories.set(list);
    } catch (error) {
      this.notificationService.error((error as Error).message);
    }
  }

  // ============ CREAR ============
  onOpenCreateModal(): void {
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  async onCreateMovement(payload: MovementPayload): Promise<void> {
    this.loadingService.show();
    try {
      await this.incomeService.create(payload);
      await this.loadMovements();
      this.closeCreateModal();
      this.notificationService.success('Ingreso creado correctamente.');
    } catch (error) {
      this.notificationService.error((error as Error).message);
    } finally {
      this.loadingService.hide();
    }
  }

  // ============ EDITAR ============
  onEditMovement(movement: MovementInterface): void {
    this.movementToEdit.set(movement);
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.movementToEdit.set(null);
  }

  async onUpdateMovement(payload: MovementPayload): Promise<void> {
    const current = this.movementToEdit();
    if (!current) return;

    this.loadingService.show();
    try {
      await this.incomeService.update(current.id, payload);
      await this.loadMovements();
      this.closeEditModal();
      this.notificationService.success('Ingreso actualizado correctamente.');
    } catch (error) {
      this.notificationService.error((error as Error).message);
    } finally {
      this.loadingService.hide();
    }
  }

  // ============ ELIMINAR ============
  onDeleteMovement(movement: MovementInterface): void {
    this.movementToDelete.set(movement);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.movementToDelete.set(null);
  }

  async onConfirmDelete(): Promise<void> {
    const current = this.movementToDelete();
    if (!current) return;

    this.loadingService.show();
    try {
      await this.incomeService.delete(current.id);
      await this.loadMovements();
      this.closeDeleteModal();
      this.notificationService.success('Ingreso eliminado correctamente.');
    } catch (error) {
      this.notificationService.error((error as Error).message);
    } finally {
      this.loadingService.hide();
    }
  }

}
