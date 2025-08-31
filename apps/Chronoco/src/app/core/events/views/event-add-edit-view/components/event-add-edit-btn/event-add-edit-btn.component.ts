import { Component, inject, input, InputSignal, Signal } from '@angular/core';
import { ButtonComponent } from '@chronoco-fe/ui/button/button.component';
import { EventAddEditBtnComponentStore } from './event-add-edit-btn.component.store';
import { EventAddEditViewComponentStore } from '../../event-add-edit-view.component.store';
import { ICreateEvent, IUpdateEvent } from '../../../../../../services/events-service/models/i-create-event';

@Component({
  selector: 'app-event-add-edit-btn',
  imports: [
    ButtonComponent,
  ],
  templateUrl: './event-add-edit-btn.component.html',
  styleUrl: './event-add-edit-btn.component.css',
  providers: [
    EventAddEditBtnComponentStore,
  ],
})
export class EventAddEditBtnComponent {
  public eventFormData: InputSignal<ICreateEvent | IUpdateEvent> = input.required();
  public disabled: InputSignal<boolean> = input();
  public caption: InputSignal<string> = input.required();

  private readonly componentStore: EventAddEditBtnComponentStore = inject(EventAddEditBtnComponentStore);
  private readonly addEditComponentStore: EventAddEditViewComponentStore = inject(EventAddEditViewComponentStore);

  public readonly loading: Signal<boolean> = this.componentStore.loading;

  public submitHandler(): void {
    if (this.loading()) return;

    if (this.addEditComponentStore.isEditing()) {
      this.componentStore.editEvent(this.eventFormData() as IUpdateEvent);
    } else {
      this.componentStore.addEvent(this.eventFormData() as ICreateEvent);
    }
  }
}
