import { Component, inject } from '@angular/core';
import { ModalComponent } from '@chronoco-fe/ui/modal/modal.component';
import { SchedulerInstancesStore } from '@chronoco-fe/core/planner/views/planner-view/components/scheduler-grid/stores/scheduler-instances.store';
import { IInstance } from '@chronoco-fe/models/i-legend';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ButtonComponent } from '@chronoco-fe/ui/button/button.component';
import { SchedulerSearchScrollStore } from '@chronoco-fe/core/planner/views/planner-view/components/scheduler-grid/stores/scheduler-search-scroll.store';

@Component({
  selector: 'app-scheduler-grid-single-block-remove-modal',
  imports: [
    ModalComponent,
    ButtonComponent,
  ],
  templateUrl: './scheduler-grid-single-block-remove-modal.component.html',
  styleUrl: './scheduler-grid-single-block-remove-modal.component.css',
})
export class SchedulerGridSingleBlockRemoveModalComponent {
  public instance: IInstance = inject(DIALOG_DATA);

  private readonly instancesStore: SchedulerInstancesStore = inject(SchedulerInstancesStore);
  private readonly searchScrollStore: SchedulerSearchScrollStore = inject(SchedulerSearchScrollStore);
  private readonly dialogRef: DialogRef = inject(DialogRef);

  public removeInstanceHandler(): void {
    this.instancesStore.delete(this.instance.id);
    this.closeModalHandler();
    this.searchScrollStore.scrollToPreviousInstance();
  }

  public closeModalHandler(): void {
    this.dialogRef.close();
  }
}
