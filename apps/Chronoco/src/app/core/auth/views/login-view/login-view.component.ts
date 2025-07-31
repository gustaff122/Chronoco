import { Component } from '@angular/core';
import { InputComponent } from '@chronoco-fe/ui/input/input.component';
import { ButtonComponent } from '@chronoco-fe/ui/button/button.component';

@Component({
  selector: 'app-login-view',
  imports: [
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css',
})
export class LoginViewComponent {

}
