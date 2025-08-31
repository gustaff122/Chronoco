import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ModalComponent } from '@chronoco-fe/ui/modal/modal.component';
import { InputComponent } from '@chronoco-fe/ui/input/input.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { IEvent } from '../../services/events-service/models/i-event';
import { ButtonComponent } from '@chronoco-fe/ui/button/button.component';
import { EventsService } from '../../services/events-service/events.service';
import { finalize } from 'rxjs';
import { RoutesEnum } from '@chronoco-fe/models/routes.enum';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scheduler-delete-event-modal',
  imports: [
    ModalComponent,
    InputComponent,
    ButtonComponent,
    FormsModule,
  ],
  templateUrl: './scheduler-delete-event-modal.component.html',
  styleUrl: './scheduler-delete-event-modal.component.css',
})
export class SchedulerDeleteEventModalComponent {
  public event: IEvent = inject(DIALOG_DATA);
  private readonly dialogRef: DialogRef = inject(DialogRef);
  private readonly router: Router = inject(Router);
  private readonly eventsService: EventsService = inject(EventsService);

  public typedName: string = null;
  public readonly loading: WritableSignal<boolean> = signal(false);

  public closeModal(): void {
    this.dialogRef.close();
  }

  public deleteEvent(): void {
    if (this.typedName !== this.event?.name) return;

    this.loading.set(true);
    this.eventsService.remove(this.event.id).pipe(
      finalize(() => {
        this.loading.set(false);
      }),
    ).subscribe(() => {
      this.dialogRef.close();
      this.router.navigate([ '/', RoutesEnum.EVENTS ]);
    });
  }
}
