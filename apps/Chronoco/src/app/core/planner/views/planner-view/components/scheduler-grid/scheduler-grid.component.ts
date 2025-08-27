import { SchedulerGridColumnsComponent } from './components/scheduler-grid-columns/scheduler-grid-columns.component';
import { SchedulerGridComponentStore } from './scheduler-grid.component.store';
import { SchedulerGridRowsComponent } from './components/scheduler-grid-rows/scheduler-grid-rows.component';
import { Component, ElementRef, inject, input, InputSignal, Signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerGridCellsComponent } from './components/scheduler-grid-cells/scheduler-grid-cells.component';
import { SchedulerGridBlocksComponent } from './components/scheduler-grid-blocks/scheduler-grid-blocks.component';
import { IRoom } from '@chronoco-fe/models/i-room';
import { SchedulerGridBlockHeightPipe } from '@chronoco-fe/pipes/scheduler-grid-block-height.pipe';
import { SchedulerGridScrollStore } from './stores/scheduler-grid-scroll.store';

@Component({
  selector: 'app-scheduler-grid',
  imports: [ CommonModule, SchedulerGridColumnsComponent, SchedulerGridRowsComponent, SchedulerGridCellsComponent, SchedulerGridBlocksComponent, SchedulerGridBlockHeightPipe ],
  templateUrl: './scheduler-grid.component.html',
  styleUrl: './scheduler-grid.component.css',
})
export class SchedulerGridComponent {
  public rooms: InputSignal<IRoom[]> = input.required();
  public timeFrom: InputSignal<Date> = input(new Date(2025, 1, 14, 0, 0, 0, 0));
  public timeTo: InputSignal<Date> = input(new Date(2025, 1, 17, 0, 0, 0, 0));

  public readonly scrollContainer: Signal<ElementRef<HTMLElement>> = viewChild('scrollContainer');

  private readonly componentStore: SchedulerGridComponentStore = inject(SchedulerGridComponentStore);
  private readonly gridScrollStore: SchedulerGridScrollStore = inject(SchedulerGridScrollStore);

  constructor() {
    this.componentStore.rooms = this.rooms;
    this.componentStore.timeFrom = this.timeFrom;
    this.componentStore.timeTo = this.timeTo;
    this.gridScrollStore.scrollContainer = this.scrollContainer;
  }
}
