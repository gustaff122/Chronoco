import { Component, input, InputSignal, Optional, Self } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';

type InputType = 'password' | 'number' | 'text' | 'search';

@Component({
  selector: 'app-input',
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, NgIcon ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  viewProviders: [
    provideIcons({ heroMagnifyingGlass }),
  ],
})
export class InputComponent implements ControlValueAccessor {
  public inputType: InputSignal<InputType> = input('text' as InputType);
  public inputPlaceholder: InputSignal<string> = input(null);
  public label: InputSignal<string> = input(null);
  public inputId: InputSignal<string> = input(null);
  public search: InputSignal<boolean> = input(false);

  public value: string = null;

  constructor(
    @Self() @Optional() public readonly ngControl: NgControl,
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  public updateChanges(): void {
    this.onChange(this.value);
    this.registerOnTouched(Boolean(this.onTouch));
  }

  public writeValue(value: string): void {
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
