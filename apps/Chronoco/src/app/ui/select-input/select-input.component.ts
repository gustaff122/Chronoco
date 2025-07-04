import { Component, input, InputSignal, Optional, Self } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { ISelectOption } from '@chronoco-fe/models/i-select-option';

@Component({
  selector: 'app-select-input',
  imports: [ CommonModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.css',
})
export class SelectInputComponent implements ControlValueAccessor {
  public options: InputSignal<ISelectOption[]> = input([]);
  public inputId: InputSignal<string> = input(null);
  public label: InputSignal<string> = input(null);

  public value: string = null;

  public updateChanges(): void {
    this.onChange(this.value);
    this.registerOnTouched(Boolean(this.onTouch));
  }

  constructor(
    @Self() @Optional() public readonly ngControl: NgControl,
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: string): void {
    this.value = value;
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
