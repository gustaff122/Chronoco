import { afterNextRender, Component, input, InputSignal, signal, WritableSignal } from '@angular/core';

export type TooltipTheme = 'light' | 'dark';

@Component({
  imports: [],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.css',
})
export class TooltipComponent {
  public text: InputSignal<string> = input.required();
  public theme: InputSignal<TooltipTheme> = input('dark' as TooltipTheme);

  public readonly isInitialized: WritableSignal<boolean> = signal(false);

  constructor() {
    afterNextRender(() => this.isInitialized.set(true));
  }
}
