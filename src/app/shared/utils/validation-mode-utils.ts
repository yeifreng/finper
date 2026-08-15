import { FormGroup } from "@angular/forms";

export class ValidationModeUtils {

  static clearValidators(
    form: FormGroup,
    fields: string[]
  ): void {

    fields.forEach(field => {
      form.controls[field].clearValidators();
      form.controls[field].updateValueAndValidity();
    });

  }

}
