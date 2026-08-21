import { Component, computed, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFormInterface } from '../../interfaces/auth-form.interface';
import { FormUtils } from '../../../../shared/utils/form-utils';
import { ValidationModeUtils } from '../../../../shared/utils/validation-mode-utils';

@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.css',
})
export default class AuthForm {

  //Creamos el objeto formUtils para poder usar sus metodos en el template
  formUtils = FormUtils;

  //Configuramos la validacion del formulario para el modo de login
  //LLamando al ValidationModeUtils para limpiar los validadores de los campos que no se usan en el modo de login
  private configureLoginValidation(): void {

  ValidationModeUtils.clearValidators(this.form, [
    'firstName',
    'lastName',
    'confirmPassword',
  ]);

}

private configureForgotPasswordValidation(): void {

  ValidationModeUtils.clearValidators(this.form, [
    'firstName',
    'lastName',
    'password',
    'confirmPassword',
  ]);

}

    // 1. Inyección de dependencias
    private readonly fb = inject(NonNullableFormBuilder);

    // 2. Inputs
    mode = input.required<'login' | 'register' | 'forgot-password'>();

    // 3. Outputs
    formSubmit = output<AuthFormInterface>();

    // 4. Signals y Computed
    loading = signal(false);

    isRegisterMode = computed(() => this.mode() === 'register');
    isLoginMode = computed(() => this.mode() === 'login');
    isForgotPasswordMode = computed(() => this.mode() === 'forgot-password');

    // 5. Formulario
    form = this.fb.group({
      firstName: this.fb.control('', [ Validators.required, Validators.minLength(3),Validators.maxLength(10),]),
      lastName: this.fb.control('', [Validators.required,Validators.minLength(3),Validators.maxLength(10),]),
      email: this.fb.control('', [Validators.required,Validators.email,]),
      password: this.fb.control('', [Validators.required,Validators.minLength(8),]),
      confirmPassword: this.fb.control('', [Validators.required,Validators.minLength(8),]),
    });

    //Envio de los datos del formulario
    onSubmit() {

      //Si estamos en el modo de login, configuramos la validacion del formulario para el modo de login
      if (this.isLoginMode()) {
        this.configureLoginValidation();
      }

      if (this.isForgotPasswordMode()) {
        this.configureForgotPasswordValidation();
      }

      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }

      const data = this.form.getRawValue();

      switch (this.mode()) {

        case 'register':

          this.formSubmit.emit({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
          });

          break;

        case 'login':

          this.formSubmit.emit({
            email: data.email,
            password: data.password,
          });

          break;

        case 'forgot-password':

          this.formSubmit.emit({
            email: data.email,
          });

          break;
      }
    }

}
