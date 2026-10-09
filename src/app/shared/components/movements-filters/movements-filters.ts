import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CategoryInterface } from '../../../features/category/interfaces/category.interface';
import { DateRangePreset, MovementFilters } from '../../interfaces/movement-filters.interface';
import { DateUtils } from '../../utils/date-utils';

@Component({
  selector: 'app-movements-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './movements-filters.html',
  styleUrl: './movements-filters.css',
})
export class MovementsFilters {

   private readonly formBuilder = inject(FormBuilder);

  readonly categories = input.required<CategoryInterface[]>();

  readonly filtersChange = output<MovementFilters>();

  readonly DateUtils = DateUtils

  protected readonly today = DateUtils.today();

  readonly form = this.formBuilder.group({
    dateRange: ['all' as DateRangePreset],
    dateFrom: [''],
    dateTo: [''],
    categoryId: ['all'],
    search: [''],
  });

  readonly dateRangeOptions: { value: DateRangePreset; label: string }[] = [
    { value: 'all', label: 'Todo' },
    { value: 'this-month', label: 'Este mes' },
    { value: 'last-month', label: 'Mes anterior' },
    { value: 'last-3-months', label: 'Últimos 3 meses' },
    { value: 'this-year', label: 'Este año' },
    { value: 'custom', label: 'Personalizado' },
  ];

  constructor() {
    // Cada vez que cambia cualquier control, emitimos los filtros calculados
    this.form.valueChanges.subscribe(() => {
      this.filtersChange.emit(this.buildFilters());
    });
  }

  private buildFilters(): MovementFilters {
    const raw = this.form.getRawValue();

    const filters: MovementFilters = {
      dateRange: raw.dateRange ?? 'all',
      dateFrom: '',
      dateTo: '',
      categoryId: raw.categoryId ?? 'all',
      search: (raw.search ?? '').trim(),
    };

    // Calcular fechas según el preset
    switch (filters.dateRange) {
      case 'this-month':
        filters.dateFrom = DateUtils.firstDayOfMonth();
        filters.dateTo = DateUtils.lastDayOfMonth();
        break;
      case 'last-month':
        filters.dateFrom = DateUtils.firstDayOfLastMonth();
        filters.dateTo = DateUtils.lastDayOfLastMonth();
        break;
      case 'last-3-months':
        filters.dateFrom = DateUtils.monthsAgo(3);
        filters.dateTo = DateUtils.today();
        break;
      case 'this-year':
        filters.dateFrom = DateUtils.firstDayOfYear();
        filters.dateTo = DateUtils.lastDayOfYear();
        break;
      case 'custom':
        filters.dateFrom = raw.dateFrom ?? '';
        filters.dateTo = raw.dateTo ?? '';
        break;
      case 'all':
      default:
        // Sin filtro de fecha
        break;
    }

    return filters;
  }

  onClear(): void {
    this.form.reset({
      dateRange: 'all',
      dateFrom: '',
      dateTo: '',
      categoryId: 'all',
      search: '',
    });
  }

}
