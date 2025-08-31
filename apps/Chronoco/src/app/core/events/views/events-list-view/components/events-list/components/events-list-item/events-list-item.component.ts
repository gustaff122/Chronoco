import { Component, input, InputSignal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
import { RoutesEnum } from '@chronoco-fe/models/routes.enum';
import { IEvent } from '../../../../../../../../services/events-service/models/i-event';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-events-list-item',
  imports: [
    NgIcon,
    RouterLink,
    DatePipe,
  ],
  templateUrl: './events-list-item.component.html',
  styleUrl: './events-list-item.component.css',
})
export class EventsListItemComponent {
  public item: InputSignal<IEvent> = input.required();

  protected readonly RoutesEnum = RoutesEnum;
}
