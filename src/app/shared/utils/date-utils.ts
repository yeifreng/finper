import { AbstractControl, ValidationErrors } from '@angular/forms';

export class DateUtils {

  /**
   * Retorna la fecha de hoy en formato YYYY-MM-DD usando hora LOCAL.
   * Útil para usarla en atributos [max] o [min] de inputs type=date.
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
   * Evita el desfase de un día que ocurre al usar new Date('YYYY-MM-DD')
   * (que JS interpreta como UTC).
   */
  static parseLocal(value: string): Date {
    return new Date(value + 'T00:00:00');
  }

  /**
   * Validador para Reactive Forms que rechaza fechas posteriores a hoy.
   * Uso: [Validators.required, DateUtils.maxDateTodayValidator()]
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
}
