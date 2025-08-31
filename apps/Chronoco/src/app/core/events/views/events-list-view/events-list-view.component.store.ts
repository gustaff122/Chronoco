import { computed, inject, Injectable, ResourceRef, Signal } from '@angular/core';
import { IEvent } from '../../../../services/events-service/models/i-event';
import { rxResource } from '@angular/core/rxjs-interop';
import { EventsService } from '../../../../services/events-service/events.service';

@Injectable()
export class EventsListViewComponentStore {
  private readonly eventsService: EventsService = inject(EventsService);

  private _list: ResourceRef<IEvent[]> = rxResource({
    stream: () => this.eventsService.findAll(),
    defaultValue: [],
  });

  public readonly loading: Signal<boolean> = computed(() => this._list.isLoading());

  public readonly ongoingList: Signal<IEvent[]> = computed(() =>
    this._list.value().filter(event => this.getEventStatus(event) === 'ongoing'),
  );

  public readonly upcomingList: Signal<IEvent[]> = computed(() =>
    this._list.value().filter(event => this.getEventStatus(event) === 'upcoming'),
  );

  public readonly pastList: Signal<IEvent[]> = computed(() =>
    this._list.value().filter(event => this.getEventStatus(event) === 'past'),
  );

  private getEventStatus(event: IEvent): 'ongoing' | 'upcoming' | 'past' {
    const from = event.dateFrom ? new Date(event.dateFrom) : undefined;
    const to = event.dateTo ? new Date(event.dateTo) : undefined;

    if (!from && !to) return 'upcoming';
    if (to && to < new Date()) return 'past';
    if (from && from <= new Date() && (!to || new Date() <= to)) return 'ongoing';
    return 'upcoming';
  }
}