import { Component, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { InitialsPipe } from '@chronoco-fe/pipes/initials.pipe';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-scheduler-header-active-users-item',
  imports: [
    InitialsPipe,
    OverlayModule,
  ],
  templateUrl: './scheduler-header-active-users-item.component.html',
  styleUrl: './scheduler-header-active-users-item.component.css',
})
export class SchedulerHeaderActiveUsersItemComponent {
  public user: InputSignal<string> = input.required();

  public isOpen: WritableSignal<boolean> = signal(false);

  public openHandler(): void {
    this.isOpen.set(true);
  }

  public closeHandler(): void {
    this.isOpen.set(false);
  }
}
