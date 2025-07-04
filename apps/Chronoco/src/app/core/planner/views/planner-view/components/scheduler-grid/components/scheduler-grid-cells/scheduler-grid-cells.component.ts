import { Component, inject, Signal, viewChild } from '@angular/core';
import { SchedulerGridComponentStore } from '../../scheduler-grid.component.store';
import { SchedulerGridSingleCellComponent } from './components/scheduler-grid-single-cell/scheduler-grid-single-cell.component';
import { IRoom } from '@chronoco-fe/models/i-room';
import { SchedulerGenerateHoursCaptionsPipe } from '@chronoco-fe/pipes/scheduler-generate-hours-captions.pipe';

@Component({
  selector: 'app-scheduler-grid-cells',
  imports: [
    SchedulerGridSingleCellComponent,
    SchedulerGenerateHoursCaptionsPipe,
  ],
  templateUrl: './scheduler-grid-cells.component.html',
  styleUrl: './scheduler-grid-cells.component.css',
})
export class SchedulerGridCellsComponent {
  public container: Signal<HTMLDivElement> = viewChild('container');

  private readonly gridComponentStore: SchedulerGridComponentStore = inject(SchedulerGridComponentStore);

  public readonly rooms: Signal<IRoom[]> = this.gridComponentStore.rooms;
  public readonly timeFrom: Signal<Date> = this.gridComponentStore.timeFrom;
  public readonly timeTo: Signal<Date> = this.gridComponentStore.timeTo;
}
