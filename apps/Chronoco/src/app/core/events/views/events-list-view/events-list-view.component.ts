import { Component, inject, Signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { heroArrowsPointingOut, heroStar } from '@ng-icons/heroicons/outline';
import { ButtonComponent } from '@chronoco-fe/ui/button/button.component';
import { RouterLink } from '@angular/router';
import { RoutesEnum } from '@chronoco-fe/models/routes.enum';
import { PageContainerComponent } from '@chronoco-fe/ui/page-container/page-container.component';
import { NgTemplateOutlet } from '@angular/common';
import { EventsListViewComponentStore } from './events-list-view.component.store';
import { IEvent } from '../../../../services/events-service/models/i-event';
import { EventsListComponent } from './components/events-list/events-list.component';

@Component({
  selector: 'app-events-list-view',
  imports: [
    ButtonComponent,
    RouterLink,
    PageContainerComponent,
    NgTemplateOutlet,
    EventsListComponent,
  ],
  templateUrl: './events-list-view.component.html',
  styleUrl: './events-list-view.component.css',
  providers: [
    EventsListViewComponentStore,
  ],
  viewProviders: [
    provideIcons({ heroArrowsPointingOut, heroStar }),
  ],
})
export class EventsListViewComponent {
  private readonly componentStore: EventsListViewComponentStore = inject(EventsListViewComponentStore);

  public readonly loading: Signal<boolean> = this.componentStore.loading;
  public readonly ongoingList: Signal<IEvent[]> = this.componentStore.ongoingList;
  public readonly upcomingList: Signal<IEvent[]> = this.componentStore.upcomingList;
  public readonly pastList: Signal<IEvent[]> = this.componentStore.pastList;

  protected readonly RoutesEnum: typeof RoutesEnum = RoutesEnum;
}
