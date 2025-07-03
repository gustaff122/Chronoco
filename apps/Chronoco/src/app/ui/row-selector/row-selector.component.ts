import { Component, input, InputSignal, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ISelectOption } from '@chronoco-fe/models/i-select-option';

@Component({
  selector: 'app-row-selector',
  templateUrl: './row-selector.component.html',
  styleUrl: './row-selector.component.css',
})
export class RowSelectorComponent implements ControlValueAccessor {
  public options: InputSignal<ISelectOption[]> = input([ { value: 'friday', display: 'Piątek' }, { value: 'saturday', display: 'Sobota' }, { value: 'sunday', display: 'Niedziela' } ]);
  public selectedValue: ISelectOption = null;

  constructor(
    @Self() @Optional() public readonly ngControl: NgControl,
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  public writeValue(value: ISelectOption): void {
    this.selectedValue = value;
  }

  public registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  public onChange: any = (): void => {
  };

  public onTouch: any = (): void => {
  };

}
