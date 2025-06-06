import { IRoom } from '../models/i-room';
import { SchedulerGridColumnsComponent } from './components/scheduler-grid-columns/scheduler-grid-columns.component';
import { SchedulerGridComponentStore } from './scheduler-grid.component.store';
import { SchedulerGridRowsComponent } from './components/scheduler-grid-rows/scheduler-grid-rows.component';
import { Component, inject, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerGridCellsComponent } from './components/scheduler-grid-cells/scheduler-grid-cells.component';
import { SchedulerGridBlocksComponent } from './components/scheduler-grid-blocks/scheduler-grid-blocks.component';
import { SchedulerSelectingStore } from './stores/scheduler-selecting.store';
import { SchedulerGridBlockHeightPipe } from '../pipes/scheduler-grid-block-height.pipe';

@Component({
  selector: 'lib-scheduler-grid',
  imports: [ CommonModule, SchedulerGridColumnsComponent, SchedulerGridRowsComponent, SchedulerGridCellsComponent, SchedulerGridBlocksComponent, SchedulerGridBlockHeightPipe ],
  templateUrl: './scheduler-grid.component.html',
  styleUrl: './scheduler-grid.component.css',
  providers: [
    SchedulerGridComponentStore,
    SchedulerSelectingStore,
  ],
})
export class SchedulerGridComponent {
  public rooms: InputSignal<IRoom[]> = input.required();
  public timeFrom: InputSignal<string> = input('00:00');
  public timeTo: InputSignal<string> = input('23:59');

  private readonly componentStore: SchedulerGridComponentStore = inject(SchedulerGridComponentStore);

  constructor() {
    this.componentStore.rooms = this.rooms;
    this.componentStore.timeFrom = this.timeFrom;
    this.componentStore.timeTo = this.timeTo;
  }
}
