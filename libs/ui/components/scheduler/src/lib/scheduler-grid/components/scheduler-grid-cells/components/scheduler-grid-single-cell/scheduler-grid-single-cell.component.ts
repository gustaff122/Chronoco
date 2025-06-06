import { Component, inject, input, InputSignal, Signal } from '@angular/core';
import { SchedulerHourHeightPipe } from '../../../../../pipes/scheduler-hour-height.pipe';
import { IRoom } from '../../../../../models/i-room';
import { SchedulerGridComponentStore } from '../../../../scheduler-grid.component.store';
import { SCHEDULER_HOUR_CAPTION_HEIGHT } from '../../../../../const/scheduler-grid-sizes';

@Component({
  selector: 'lib-scheduler-grid-single-cell',
  imports: [
    SchedulerHourHeightPipe,
  ],
  templateUrl: './scheduler-grid-single-cell.component.html',
  styleUrl: './scheduler-grid-single-cell.component.css',
})
export class SchedulerGridSingleCellComponent {
  public room: InputSignal<IRoom> = input.required();
  public isLastRow: InputSignal<boolean> = input.required();
  public isLastColumn: InputSignal<boolean> = input.required();
  public time: InputSignal<string> = input.required();

  private readonly gridComponentStore: SchedulerGridComponentStore = inject(SchedulerGridComponentStore);

  public readonly SCHEDULER_HOUR_CAPTION_HEIGHT: number = SCHEDULER_HOUR_CAPTION_HEIGHT;
  public readonly timeTo: Signal<string> = this.gridComponentStore.timeTo;
}
