import { FormGroup } from "@angular/forms";

export class FormUtils {

  static isValidField(form: FormGroup, fieldName: string): boolean | null{
    return (
      !! form.controls[fieldName].errors &&
         form.controls[fieldName].touched
    )
  }

    static getFieldError(form:FormGroup,fieldName:string): string | null{
    //Si no existe el error, que retorne null y salga
    if (!form.controls[fieldName]) {
        return null
    }
    // guardamos los errores que arroje el form
    const errors = form.controls[fieldName].errors ?? {};
    // Recorremos los errores
    for(const key of Object.keys(errors)){
      switch(key){
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Minimo de ${errors['minlength'].requiredLength} caracteres.`;
        case 'min':
          return `Valor minimo de ${errors['min'].min}.`;
        case 'maxlength':
          return `Máximo de ${errors['maxlength'].requiredLength} caracteres.`;
        case 'email':
          return 'Correo electrónico inválido.';
      }
    }
    return null
  }

}

