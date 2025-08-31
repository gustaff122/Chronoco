import { Component, input, InputSignal, OnInit, Optional, Self, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { ulid } from 'ulid';

type InputType = 'password' | 'number' | 'text' | 'search' | 'time' | 'datetime-local';
type InputTheme = 'dark' | 'light';

@Component({
  selector: 'app-input',
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, NgIcon ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  viewProviders: [
    provideIcons({ heroMagnifyingGlass }),
  ],
})
export class InputComponent implements ControlValueAccessor, OnInit {
  public inputType: InputSignal<InputType> = input('text' as InputType);
  public theme: InputSignal<InputTheme> = input('dark' as InputTheme);
  public placeholder: InputSignal<string> = input(null);
  public label: InputSignal<string> = input(null);
  public inputId: InputSignal<string> = input(ulid());
  public search: InputSignal<boolean> = input(false);

  public isDisabled: WritableSignal<boolean> = signal(false);

  public readonly isRequired: WritableSignal<boolean> = signal(false);

  public value: string = null;

  constructor(
    @Self() @Optional() public readonly ngControl: NgControl,
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  public ngOnInit(): void {
    this.isRequired.set(this.ngControl?.control?.hasValidator?.(Validators.required) ?? false);
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
