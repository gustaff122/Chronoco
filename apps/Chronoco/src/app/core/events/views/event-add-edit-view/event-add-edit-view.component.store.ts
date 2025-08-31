import { computed, inject, Injectable, Injector, ResourceRef, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { IEvent } from '../../../../services/events-service/models/i-event';
import { EventsService } from '../../../../services/events-service/events.service';

@Injectable()
export class EventAddEditViewComponentStore {
  private readonly eventsService: EventsService = inject(EventsService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly injector: Injector = inject(Injector);

  public readonly editedId: Signal<string> = toSignal(this.activatedRoute.params.pipe(map((params) => params['id'])), { injector: this.injector });
  public readonly isEditing: Signal<boolean> = computed(() => Boolean(this.editedId()));

  private readonly _editedEvent: ResourceRef<IEvent> = rxResource({
    params: () => this.editedId(),
    stream: ({ params: editedId }) => this.eventsService.findOne(editedId),
    defaultValue: null,
  });

  public readonly loading: Signal<boolean> = computed(() => this._editedEvent.isLoading());

  public readonly editedEvent: Signal<IEvent> = computed(() => this._editedEvent.value());

  public refresh(): void {
    this._editedEvent.reload();
  }
}