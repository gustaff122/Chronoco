import { Component, inject, Injector, OnInit, Signal } from '@angular/core';
import { PageContainerComponent } from '@chronoco-fe/ui/page-container/page-container.component';
import { InputComponent } from '@chronoco-fe/ui/input/input.component';
import { TextareaComponent } from '@chronoco-fe/ui/textarea/textarea.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventAddEditViewComponentStore } from './event-add-edit-view.component.store';
import { IEvent } from '../../../../services/events-service/models/i-event';
import { toObservable } from '@angular/core/rxjs-interop';
import { skip, take } from 'rxjs';
import { EventAddEditBtnComponent } from './components/event-add-edit-btn/event-add-edit-btn.component';
import { NgTemplateOutlet } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowPath } from '@ng-icons/heroicons/outline';
import { ButtonComponent } from '@chronoco-fe/ui/button/button.component';
import { Dialog } from '@angular/cdk/dialog';
import { EventsService } from '../../../../services/events-service/events.service';
import { RoutesEnum } from '@chronoco-fe/models/routes.enum';

interface IAddEditForm {
  name: FormControl<string>;
  subtitle: FormControl<string>;
  dateFrom: FormControl<string>;
  dateTo: FormControl<string>;
  address: FormControl<string>;
  maxCapacity: FormControl<number>;
  approximatePrice: FormControl<string>;
  description: FormControl<string>;
}

@Component({
  selector: 'app-event-add-edit-view',
  imports: [
    PageContainerComponent,
    InputComponent,
    TextareaComponent,
    ReactiveFormsModule,
    EventAddEditBtnComponent,
    NgTemplateOutlet,
    NgIcon,
    ButtonComponent,
  ],
  templateUrl: './event-add-edit-view.component.html',
  styleUrl: './event-add-edit-view.component.css',
  viewProviders: [
    provideIcons({
      heroArrowPath,
    }),
  ],
  providers: [
    EventAddEditViewComponentStore,
  ],
})
export class EventAddEditViewComponent implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly injector: Injector = inject(Injector);
  private readonly dialog: Dialog = inject(Dialog);
  private readonly eventsService: EventsService = inject(EventsService);
  private readonly componentStore: EventAddEditViewComponentStore = inject(EventAddEditViewComponentStore);

  public readonly isEditing: Signal<boolean> = this.componentStore.isEditing;
  public readonly editedEvent: Signal<IEvent> = this.componentStore.editedEvent;
  public readonly loading: Signal<boolean> = this.componentStore.loading;

  public form: FormGroup<IAddEditForm>;

  public ngOnInit(): void {
    this.buildForm();
    this.initEditingFormValues();
  }

  public openDeletingModal(): void {
    import('@chronoco-fe/modals/scheduler-delete-event-modal/scheduler-delete-event-modal.component').then(({ SchedulerDeleteEventModalComponent }) => {
      this.dialog.open(SchedulerDeleteEventModalComponent, {
        data: this.editedEvent(),
        providers: [
          {
            provide: EventsService,
            useValue: this.eventsService,
          },
        ],
      });
    });
  }

  private buildForm(): void {
    this.form = this.formBuilder.group<IAddEditForm>({
      name: new FormControl(null, [ Validators.required, Validators.minLength(3), Validators.maxLength(256) ]),
      subtitle: new FormControl(null, [ Validators.maxLength(256) ]),
      dateFrom: new FormControl(null),
      dateTo: new FormControl(null),
      address: new FormControl(null, [ Validators.maxLength(512) ]),
      maxCapacity: new FormControl(null),
      approximatePrice: new FormControl(null),
      description: new FormControl(),
    });
  }

  private initEditingFormValues(): void {
    if (this.isEditing()) {
      this.form.disable();

      toObservable(this.editedEvent, { injector: this.injector }).pipe(
        skip(1),
        take(1),
      ).subscribe(({ dateFrom, dateTo, ...rest }) => {
        const formattedDateFrom = new Date(dateFrom).toISOString().slice(0, 16);
        const formattedDateTo = new Date(dateTo).toISOString().slice(0, 16);

        this.form.patchValue({
          dateFrom: formattedDateFrom,
          dateTo: formattedDateTo,
          ...rest,
        });

        this.form.enable();
      });
    }
  }

  protected readonly RoutesEnum = RoutesEnum;
}
