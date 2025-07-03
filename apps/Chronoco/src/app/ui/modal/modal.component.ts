import { Component, inject, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'lib-modal',
  imports: [ CommonModule, NgIcon ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  viewProviders: [
    provideIcons({ heroXMark }),
  ],
})
export class ModalComponent {
  public caption: InputSignal<string> = input();

  private readonly dialogRef: DialogRef = inject(DialogRef);

  public closeHandler(): void {
    this.dialogRef.close();
  }
}
