import { Component, input, InputSignal, Optional, Self, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { ulid } from 'ulid';

type TextareaTheme = 'dark' | 'light';

@Component({
  selector: 'app-textarea',
  imports: [ CommonModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.css',
  viewProviders: [
    provideIcons({ heroMagnifyingGlass }),
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  public placeholder: InputSignal<string> = input(null);
  public label: InputSignal<string> = input(null);
  public rows: InputSignal<string | number> = input();
  public inputId: InputSignal<string> = input(ulid());
  public theme: InputSignal<TextareaTheme> = input('dark' as TextareaTheme);

  public isDisabled: WritableSignal<boolean> = signal(false);

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

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
