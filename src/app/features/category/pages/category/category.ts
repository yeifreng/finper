import { Component, HostListener, inject, signal } from '@angular/core';
import { CategoryService } from '../../services/category-service';
import { NotificationService } from '../../../../core/services/notification-service';
import { LoadingService } from '../../../../core/services/loading-service';
import { CategoryInterface, CategoryPayload } from '../../interfaces/category.interface';
import { CategoryForm } from '../../components/category-form/category-form';
import { ConfirmModal } from '../../../../shared/components/confirm-modal/confirm-modal';
import { CategoryList } from '../../components/category-list/category-list';
import { Sidebar } from '../../../../shared/components/sidebar/sidebar';
import { Menu } from '../../../../shared/components/menu/menu';
import { Footer } from '../../../../shared/components/footer/footer';

@Component({
  selector: 'app-category',
  imports: [CategoryForm, ConfirmModal, CategoryList, Sidebar, Menu, Footer],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export default class Category {

   private readonly categoryService = inject(CategoryService);
  private readonly notificationService = inject(NotificationService);
  private readonly loadingService = inject(LoadingService);


  //SIDEBAR
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

  readonly categories = signal<CategoryInterface[]>([]);

  // Modal de creación
readonly isCreateModalOpen = signal(false);

  // Modal de edición
  readonly isEditModalOpen = signal(false);
  readonly categoryToEdit = signal<CategoryInterface | null>(null);

  // Modal de confirmación de eliminación
  readonly isDeleteModalOpen = signal(false);
  readonly categoryToDelete = signal<CategoryInterface | null>(null);

  async ngOnInit(): Promise<void> {
    await this.loadCategories();
  }

  async loadCategories(): Promise<void> {
    this.loadingService.show();
    try {
      const list = await this.categoryService.getAll();
      this.categories.set(list);
    } catch (error) {
      this.notificationService.error((error as Error).message);
    } finally {
      this.loadingService.hide();
    }
  }

  // ============ CREAR ============

  onOpenCreateModal(): void {
    this.isCreateModalOpen.set(true);
  }

  async onCreateCategory(payload: CategoryPayload): Promise<void> {
    this.loadingService.show();
    try {
      await this.categoryService.create(payload);
      await this.loadCategories();
      this.closeCreateModal();
      this.notificationService.success('Categoría creada correctamente.');
    } catch (error) {
      this.notificationService.error((error as Error).message);
    } finally {
      this.loadingService.hide();
    }
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  // ============ EDITAR ============
  onEditCategory(category: CategoryInterface): void {
    this.categoryToEdit.set(category);
    this.isEditModalOpen.set(true);
  }

  async onUpdateCategory(payload: CategoryPayload): Promise<void> {
    const current = this.categoryToEdit();
    if (!current) return;

    this.loadingService.show();
    try {
      await this.categoryService.update(current.id, payload);
      await this.loadCategories();
      this.closeEditModal();
      this.notificationService.success('Categoría actualizada correctamente.');
    } catch (error) {
      this.notificationService.error((error as Error).message);
    } finally {
      this.loadingService.hide();
    }
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.categoryToEdit.set(null);
  }

  // ============ ELIMINAR ============
  onDeleteCategory(category: CategoryInterface): void {
    this.categoryToDelete.set(category);
    this.isDeleteModalOpen.set(true);
  }

  async onConfirmDelete(): Promise<void> {
    const current = this.categoryToDelete();
    if (!current) return;

    this.loadingService.show();
    try {
      await this.categoryService.delete(current.id);
      await this.loadCategories();
      this.closeDeleteModal();
      this.notificationService.success('Categoría eliminada correctamente.');
    } catch (error) {
      this.notificationService.error((error as Error).message);
    } finally {
      this.loadingService.hide();
    }
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.categoryToDelete.set(null);
  }



}
