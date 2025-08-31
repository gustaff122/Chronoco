import { Component, computed, input, InputSignal, Signal } from '@angular/core';

type BtnType = 'button' | 'submit' | 'reset'

type BtnSeverity = 'primary' | 'outline' | 'danger'

type BtnSize = 'md' | 'lg'

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: [ './button.component.css' ],
})
export class ButtonComponent {
  public btnType: InputSignal<BtnType> = input('button' as BtnType);
  public severity: InputSignal<BtnSeverity> = input('primary' as BtnSeverity);
  public size: InputSignal<BtnSize> = input('md' as BtnSize);
  public disabled: InputSignal<boolean> = input(false);

  public readonly severityClasses: Signal<string> = computed(() => {
    switch (this.severity()) {
      case 'primary':
        return 'bg-indigo-700 hover:bg-indigo-800 rounded-lg text-gray-200 hover:text-gray-300 disabled:opacity-70';
      case 'danger':
        return 'bg-rose-700 hover:bg-rose-800 rounded-lg text-gray-100 hover:text-gray-200 disabled:opacity-70';
      case 'outline':
        return 'text-gray-300 hover:bg-zinc-700 bg-zinc-800 border-solid border-2 border-gray-500 rounded-lg disabled:opacity-70';
    }
  });

  public readonly sizeClasses: Signal<string> = computed(() => {
    switch (this.size()) {
      case 'md':
        return 'py-2.5 px-5 text-sm';
      case 'lg':
        return 'py-3.5 px-7 text-base';
    }
  });
}
