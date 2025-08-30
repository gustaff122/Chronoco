import { Component, inject, input, InputSignal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroTrash } from '@ng-icons/heroicons/outline';
import { Dialog } from '@angular/cdk/dialog';
import { SchedulerEventInstancesStore } from '../../../../stores/scheduler-event-instances.store';
import { IRenderableBlock } from '@chronoco-fe/models/i-event-block';

@Component({
  selector: 'app-scheduler-grid-single-block-remove-btn',
  imports: [
    NgIcon,
  ],
  templateUrl: './scheduler-grid-single-block-remove-btn.component.html',
  styleUrl: './scheduler-grid-single-block-remove-btn.component.css',
  viewProviders: [
    provideIcons({ heroTrash }),
  ],
})
export class SchedulerGridSingleBlockRemoveBtnComponent {
  public instance: InputSignal<IRenderableBlock> = input.required();

  private readonly dialog: Dialog = inject(Dialog);
  private readonly eventInstancesStore: SchedulerEventInstancesStore = inject(SchedulerEventInstancesStore);

  public openModalHandler(): void {
    import('@chronoco-fe/modals/scheduler-grid-single-block-remove-modal/scheduler-grid-single-block-remove-modal.component').then(({ SchedulerGridSingleBlockRemoveModalComponent }) => {
      this.dialog.open(SchedulerGridSingleBlockRemoveModalComponent, {
        data: this.instance(),
        providers: [
          {
            provide: SchedulerEventInstancesStore,
            useValue: this.eventInstancesStore,
          },
        ],
      });
    });
  }
}
