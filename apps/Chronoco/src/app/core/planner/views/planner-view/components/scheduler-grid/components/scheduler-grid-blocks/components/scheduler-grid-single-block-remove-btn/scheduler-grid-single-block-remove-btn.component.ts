import { Component, inject, input, InputSignal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroTrash } from '@ng-icons/heroicons/outline';
import { Dialog } from '@angular/cdk/dialog';
import { SchedulerInstancesStore } from '../../../../../../stores/scheduler-instances.store';
import { IInstance } from '@chronoco-fe/models/i-legend';
import { SchedulerSearchScrollStore } from '../../../../../../stores/scheduler-search-scroll.store';

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
  public instance: InputSignal<IInstance> = input.required();

  private readonly dialog: Dialog = inject(Dialog);
  private readonly instancesStore: SchedulerInstancesStore = inject(SchedulerInstancesStore);
  private readonly searchScrollStore: SchedulerSearchScrollStore = inject(SchedulerSearchScrollStore);

  public openModalHandler(): void {
    import('@chronoco-fe/modals/scheduler-grid-single-block-remove-modal/scheduler-grid-single-block-remove-modal.component').then(({ SchedulerGridSingleBlockRemoveModalComponent }) => {
      this.dialog.open(SchedulerGridSingleBlockRemoveModalComponent, {
        data: this.instance(),
        providers: [
          {
            provide: SchedulerInstancesStore,
            useValue: this.instancesStore,
          },
          {
            provide: SchedulerSearchScrollStore,
            useValue: this.searchScrollStore,
          },
        ],
      });
    });
  }
}
