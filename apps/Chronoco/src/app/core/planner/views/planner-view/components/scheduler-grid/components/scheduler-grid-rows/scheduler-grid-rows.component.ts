import { Component, inject, Signal } from '@angular/core';
import { SchedulerGridComponentStore } from '../../scheduler-grid.component.store';
import { SchedulerGridRowCaptionComponent } from './components/scheduler-grid-row-caption/scheduler-grid-row-caption.component';
import { SchedulerGenerateHoursCaptionsPipe } from '@chronoco-fe/pipes/scheduler-generate-hours-captions.pipe';

@Component({
  selector: 'app-scheduler-grid-rows',
  imports: [
    SchedulerGenerateHoursCaptionsPipe,
    SchedulerGridRowCaptionComponent,
  ],
  templateUrl: './scheduler-grid-rows.component.html',
  styleUrl: './scheduler-grid-rows.component.css',
})
export class SchedulerGridRowsComponent {
  private readonly gridComponentStore: SchedulerGridComponentStore = inject(SchedulerGridComponentStore);

  public readonly timeFrom: Signal<string> = this.gridComponentStore.timeFrom;
  public readonly timeTo: Signal<string> = this.gridComponentStore.timeTo;
}
