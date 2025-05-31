import { Component, inject, input, InputSignal, Signal } from '@angular/core';
import { SchedulerHourHeightPipe } from '../../../../../pipes/scheduler-hour-height.pipe';
import { SchedulerGridComponentStore } from '../../../../scheduler-grid.component.store';
import { SCHEDULER_HOUR_CAPTION_HEIGHT } from '../../../../../const/scheduler-grid-sizes';

@Component({
  selector: 'lib-scheduler-grid-row-caption',
  imports: [
    SchedulerHourHeightPipe,
  ],
  templateUrl: './scheduler-grid-row-caption.component.html',
  styleUrl: './scheduler-grid-row-caption.component.css',
})
export class SchedulerGridRowCaptionComponent {
  public time: InputSignal<string> = input.required();
  public isLast: InputSignal<boolean> = input.required();

  private readonly gridComponentStore: SchedulerGridComponentStore = inject(SchedulerGridComponentStore);

  public readonly SCHEDULER_HOUR_CAPTION_HEIGHT: number = SCHEDULER_HOUR_CAPTION_HEIGHT;

  public readonly timeTo: Signal<string> = this.gridComponentStore.timeTo;
}
