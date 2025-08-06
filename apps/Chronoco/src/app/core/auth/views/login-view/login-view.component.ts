import { Component, inject, OnInit } from '@angular/core';
import { InputComponent } from '@chronoco-fe/ui/input/input.component';
import { ButtonComponent } from '@chronoco-fe/ui/button/button.component';
import { AuthStore } from '@chronoco-fe/stores/auth-store/auth.store';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface ILoginForm {
  login: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login-view',
  imports: [
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css',
})
export class LoginViewComponent implements OnInit {
  private readonly authStore: AuthStore = inject(AuthStore);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  public form: FormGroup<ILoginForm>;

  public ngOnInit(): void {
    this.buildForm();
  }

  public loginHandler(): void {
    if (this.form.valid) {
      const { login, password } = this.form.getRawValue();
      this.authStore.login(login, password);
    }
  }

  private buildForm(): void {
    this.form = this.formBuilder.group<ILoginForm>({
      login: new FormControl(null, [ Validators.required ]),
      password: new FormControl(null, [ Validators.required ]),
    });
  }
}
