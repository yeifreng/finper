import { Component, computed, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFormInterface } from '../../interfaces/auth-form.interface';
import { FormUtils } from '../../../../shared/utils/form-utils';

@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.css',
})
export default class AuthForm {

  //Creamos el objeto formUtils para poder usar sus metodos en el template
  formUtils = FormUtils;

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

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const data = this.form.getRawValue();

  this.formSubmit.emit({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
  });

  this.form.reset({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

}

}
