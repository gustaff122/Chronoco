import { Component, computed, input, InputSignal, Signal } from '@angular/core';

type BtnType = 'button' | 'submit' | 'reset'

type BtnSeverity = 'primary' | 'outline'

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: [ './button.component.css' ],
})
export class ButtonComponent {
  public btnType: InputSignal<BtnType> = input('button' as BtnType);
  public severity: InputSignal<BtnSeverity> = input('primary' as BtnSeverity);

  public readonly severityClasses: Signal<string> = computed(() => {
    switch (this.severity()) {
      case 'primary':
        return 'bg-indigo-700 text-sm rounded-lg text-gray-200 py-2.5 px-5';
      case 'outline':
        return 'px-5 py-2 text-gray-300 hover:bg-zinc-700 bg-zinc-800 border-solid border-2 border-gray-500 rounded-lg text-sm';
    }
  });
}
