import { Component, input, InputSignal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-button-icon',
  templateUrl: './button-icon.component.html',
  imports: [
    NgIcon,
  ],
  styleUrl: './button-icon.component.css',
})
export class ButtonIconComponent {
  public icon: InputSignal<string> = input();
}
