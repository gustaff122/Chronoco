import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ICreateEvent, IUpdateEvent } from '../../../../../../services/events-service/models/i-create-event';
import { EventsService } from '../../../../../../services/events-service/events.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { RoutesEnum } from '@chronoco-fe/models/routes.enum';
import { EventAddEditViewComponentStore } from '../../event-add-edit-view.component.store';

@Injectable()
export class EventAddEditBtnComponentStore {
  private readonly eventsService: EventsService = inject(EventsService);
  private readonly router: Router = inject(Router);
  private readonly addEditComponentStore: EventAddEditViewComponentStore = inject(EventAddEditViewComponentStore);

  private readonly _loading: WritableSignal<boolean> = signal(false);
  public readonly loading: Signal<boolean> = this._loading.asReadonly();

  public addEvent(event: ICreateEvent): void {
    this._loading.set(true);
    this.eventsService.create(event).pipe(
      finalize(() => this._loading.set(false)),
    ).subscribe(({ id }) => this.router.navigate([ '/', RoutesEnum.EVENTS, RoutesEnum.EVENTS_EDIT, id ]));
  }

  public editEvent(event: IUpdateEvent): void {
    this._loading.set(true);
    this.eventsService.update(this.addEditComponentStore.editedId(), event).pipe(
      finalize(() => this._loading.set(false)),
    ).subscribe(() => this.addEditComponentStore.refresh());
  }
}