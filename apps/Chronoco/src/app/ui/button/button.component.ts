import { Component, input, InputSignal } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: [ './button.component.css' ],
  imports: [ NgClass ],
})
export class ButtonComponent {
  public extraClass: InputSignal<string> = input('');
  public extraType: InputSignal<string> = input('button');
}
