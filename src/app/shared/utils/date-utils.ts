import { AbstractControl, ValidationErrors } from '@angular/forms';

export class DateUtils {

  /**
   * Retorna la fecha de hoy en formato YYYY-MM-DD usando hora LOCAL.
   */
  static today(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Convierte una fecha string YYYY-MM-DD a un Date en hora LOCAL.
   */
  static parseLocal(value: string): Date {
    return new Date(value + 'T00:00:00');
  }

  /**
   * Validador para Reactive Forms que rechaza fechas posteriores a hoy.
   */
  static maxDateTodayValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const inputDate = DateUtils.parseLocal(value);

      if (inputDate > today) {
        return { maxDate: true };
      }
      return null;
    };
  }

  /**
   * Convierte un Date a string YYYY-MM-DD en hora LOCAL.
   */
  static toISO(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Retorna el primer día del mes actual (YYYY-MM-DD).
   */
  static firstDayOfMonth(): string {
    const d = new Date();
    d.setDate(1);
    return DateUtils.toISO(d);
  }

  /**
   * Retorna el último día del mes actual (YYYY-MM-DD).
   */
  static lastDayOfMonth(): string {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return DateUtils.toISO(d);
  }

  /**
   * Retorna el primer día del mes anterior (YYYY-MM-DD).
   */
  static firstDayOfLastMonth(): string {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    d.setDate(1);
    return DateUtils.toISO(d);
  }

  /**
   * Retorna el último día del mes anterior (YYYY-MM-DD).
   */
  static lastDayOfLastMonth(): string {
    const d = new Date();
    d.setDate(0);
    return DateUtils.toISO(d);
  }

  /**
   * Retorna el primer día del año actual (YYYY-MM-DD).
   */
  static firstDayOfYear(): string {
    const d = new Date();
    d.setMonth(0);
    d.setDate(1);
    return DateUtils.toISO(d);
  }

  /**
   * Retorna el último día del año actual (YYYY-MM-DD).
   */
  static lastDayOfYear(): string {
    const d = new Date();
    d.setMonth(11);
    d.setDate(31);
    return DateUtils.toISO(d);
  }

  /**
   * Retorna la fecha de hace N meses (YYYY-MM-DD).
   * Útil para presets como "últimos 3 meses".
   */
  static monthsAgo(months: number): string {
    const d = new Date();
    d.setMonth(d.getMonth() - months);
    return DateUtils.toISO(d);
  }
}
