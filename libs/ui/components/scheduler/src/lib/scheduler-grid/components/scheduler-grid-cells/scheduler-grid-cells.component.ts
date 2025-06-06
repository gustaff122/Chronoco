import { Component, inject, Signal, viewChild } from '@angular/core';
import { SchedulerGridComponentStore } from '../../scheduler-grid.component.store';
import { IRoom } from '../../../models/i-room';
import { SchedulerGenerateHoursCaptionsPipe } from '../../../pipes/scheduler-generate-hours-captions.pipe';
import { SchedulerGridSingleCellComponent } from './components/scheduler-grid-single-cell/scheduler-grid-single-cell.component';

@Component({
  selector: 'lib-scheduler-grid-cells',
  imports: [
    SchedulerGenerateHoursCaptionsPipe,
    SchedulerGridSingleCellComponent,
  ],
  templateUrl: './scheduler-grid-cells.component.html',
  styleUrl: './scheduler-grid-cells.component.css',
})
export class SchedulerGridCellsComponent {
  public container: Signal<HTMLDivElement> = viewChild('container');

  private readonly gridComponentStore: SchedulerGridComponentStore = inject(SchedulerGridComponentStore);

  public readonly rooms: Signal<IRoom[]> = this.gridComponentStore.rooms;
  public readonly timeFrom: Signal<string> = this.gridComponentStore.timeFrom;
  public readonly timeTo: Signal<string> = this.gridComponentStore.timeTo;
}
