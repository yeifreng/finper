import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryInterface, CategoryPayload } from '../../interfaces/category.interface';
import { FormUtils } from '../../../../shared/utils/form-utils';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {

  private readonly formBuilder = inject(FormBuilder);

   /** Expuesto para usar en el template: FormUtils.isValidField(form, 'name') */
  protected readonly FormUtils = FormUtils;

  /** Valor inicial para modo edición. Si es null, es modo creación. */
  readonly initialValue = input<CategoryInterface | null>(null);

  /** true = modo edición, false = modo creación */
  readonly isEditMode = input<boolean>(false);

  /** Se emite al hacer submit con los datos válidos */
  readonly submitted = output<CategoryPayload>();

  /** Se emite al cancelar (solo se usa en modo edición) */
  readonly cancelled = output<void>();

  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    type: ['ingreso' as 'ingreso' | 'gasto', Validators.required],
  });

  constructor() {
    effect(() => {
      const initial = this.initialValue();
      if (initial) {
        this.form.patchValue({
          name: initial.name,
          type: initial.type,
        });
      } else {
        this.form.reset({ name: '', type: 'ingreso' });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted.emit({
      name: this.form.value.name!.trim(),
      type: this.form.value.type!,
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  reset(): void {
    this.form.reset({ name: '', type: 'ingreso' });
  }


}
