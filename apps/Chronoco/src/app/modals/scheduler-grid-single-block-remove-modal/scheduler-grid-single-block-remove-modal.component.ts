import { Component, inject } from '@angular/core';
import { ModalComponent } from '@chronoco-fe/ui/modal/modal.component';
import { SchedulerEventInstancesStore } from '@chronoco-fe/core/planner/views/planner-view/components/scheduler-grid/stores/scheduler-event-instances.store';
import { IRenderableBlock } from '@chronoco-fe/models/i-event-block';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ButtonComponent } from '@chronoco-fe/ui/button/button.component';

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
  public instance: IRenderableBlock = inject(DIALOG_DATA);

  private readonly eventInstancesStore: SchedulerEventInstancesStore = inject(SchedulerEventInstancesStore);
  private readonly dialogRef: DialogRef = inject(DialogRef);

  public removeInstanceHandler(): void {
    this.eventInstancesStore.delete(this.instance.id);
    this.closeModalHandler();
  }

  public closeModalHandler(): void {
    this.dialogRef.close();
  }
}
