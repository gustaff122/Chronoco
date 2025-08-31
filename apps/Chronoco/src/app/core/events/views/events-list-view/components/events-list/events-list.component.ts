import { Component, input, InputSignal } from '@angular/core';
import { EventsListItemComponent } from './components/events-list-item/events-list-item.component';
import { IEvent } from '../../../../../../services/events-service/models/i-event';
import { EventsListItemPinBtnComponent } from './components/events-list-item-pin-btn/events-list-item-pin-btn.component';

@Component({
  selector: 'app-events-list',
  imports: [
    EventsListItemComponent,
    EventsListItemPinBtnComponent,
  ],
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.css',
})
export class EventsListComponent {
  public caption: InputSignal<string> = input.required();
  public items: InputSignal<IEvent[]> = input();
}
