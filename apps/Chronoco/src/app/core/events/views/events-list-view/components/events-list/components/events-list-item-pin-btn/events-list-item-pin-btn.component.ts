import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroBookmark } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-events-list-item-pin-btn',
  imports: [
    NgIcon,
  ],
  templateUrl: './events-list-item-pin-btn.component.html',
  styleUrl: './events-list-item-pin-btn.component.css',
  viewProviders: [
    provideIcons({ heroBookmark }),
  ],
})
export class EventsListItemPinBtnComponent {

}
