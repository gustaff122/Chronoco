import { Component, inject, input, InputSignal } from '@angular/core';
import { EventBlockType } from '../../../models/event-block-type.enum';
import { SchedulerTranslateBlockTypePipe } from '../../../pipes/scheduler-translate-block-type.pipe';
import { SchedulerBlockTypeColorPipe } from '../../../pipes/scheduler-block-type-color.pipe';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'lib-scheduler-sidebar-blocks-list',
  imports: [
    SchedulerTranslateBlockTypePipe,
    SchedulerBlockTypeColorPipe,
  ],
  templateUrl: './scheduler-sidebar-blocks-list.component.html',
  styleUrl: './scheduler-sidebar-blocks-list.component.css',
})
export class SchedulerSidebarBlocksListComponent {
  public blocksType: InputSignal<EventBlockType> = input.required();

  private readonly dialog: Dialog = inject(Dialog);

  public openAddModal(): void {
    
  }
}
