import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../utils/form-utils';
import { CategoryInterface } from '../../../features/category/interfaces/category.interface';
import { MovementInterface, MovementPayload } from '../../interfaces/movement.interface';
import { DateUtils } from '../../utils/date-utils';

@Component({
  selector: 'app-movements-form',
  imports: [ReactiveFormsModule],
  templateUrl: './movements-form.html',
  styleUrl: './movements-form.css',
})
export class MovementsForm {

  private readonly formBuilder = inject(FormBuilder);

  protected readonly FormUtils = FormUtils;
  protected readonly maxDate = DateUtils.today();

  readonly categories = input.required<CategoryInterface[]>();
  readonly initialValue = input<MovementInterface | null>(null);
  readonly isEditMode = input<boolean>(false);

  readonly submitted = output<MovementPayload>();
  readonly cancelled = output<void>();

  readonly form = this.formBuilder.group({
    amount: [null as number | null, [Validators.required, Validators.min(50)]],
    categoryId: ['', Validators.required],
    date: ['', [Validators.required, DateUtils.maxDateTodayValidator()]],
    description: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const initial = this.initialValue();
      if (initial) {
        this.form.patchValue({
          amount: initial.amount,
          categoryId: initial.categoryId,
          date: initial.date,
          description: initial.description ?? '',
        });
      } else {
        this.form.reset({
          amount: null,
          categoryId: '',
          date: '',
          description: '',
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted.emit({
      amount: this.form.value.amount!,
      categoryId: this.form.value.categoryId!,
      date: this.form.value.date!,
      description: this.form.value.description!.trim() || null,
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }

}
