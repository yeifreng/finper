export type DateRangePreset =
  | 'all'
  | 'this-month'
  | 'last-month'
  | 'last-3-months'
  | 'this-year'
  | 'custom';

export interface MovementFilters {
  dateRange: DateRangePreset;
  dateFrom: string;
  dateTo: string;
  categoryId: string;
  search: string;
}
