import { Component, input, InputSignal } from '@angular/core';

export type TooltipTheme = 'light' | 'dark';

@Component({
  imports: [],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.css',
})
export class TooltipComponent {
  public text: InputSignal<string> = input.required();
  public theme: InputSignal<TooltipTheme> = input('dark' as TooltipTheme);
}
