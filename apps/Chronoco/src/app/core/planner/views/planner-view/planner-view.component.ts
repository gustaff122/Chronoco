import { Component } from '@angular/core';
import { SchedulerHeaderComponent } from './components/scheduler-header/scheduler-header.component';
import { SchedulerGridComponent } from './components/scheduler-grid/scheduler-grid.component';
import { SchedulerSidebarComponent } from './components/scheduler-sidebar/scheduler-sidebar.component';
import { IRoom } from '@chronoco-fe/models/i-room';
import { SchedulerEventInstancesStore } from './components/scheduler-grid/stores/scheduler-event-instances.store';
import { SchedulerLegendStore } from './components/scheduler-grid/stores/scheduler-legend.store';
import { SchedulerGridComponentStore } from './components/scheduler-grid/scheduler-grid.component.store';

@Component({
  selector: 'app-planner-view',
  imports: [
    SchedulerGridComponent,
    SchedulerHeaderComponent,
    SchedulerSidebarComponent,
  ],
  templateUrl: './planner-view.component.html',
  styleUrl: './planner-view.component.css',
  providers: [
    SchedulerLegendStore,
    SchedulerEventInstancesStore,
    SchedulerGridComponentStore,
  ],
})
export class PlannerViewComponent {
  public rooms: IRoom[] = [
    { name: 'Room 1', location: 'Piętro I' },
    { name: 'Room 2', location: 'Piętro I' },
    { name: 'Room 3', location: 'Piętro II' },
    { name: 'Room 4', location: 'Piwnica' },
    { name: 'Room 5', location: 'Podwórze' },
    { name: 'Room 6', location: 'Piętro I' },
    { name: 'Room 7', location: 'Piętro II' },
    { name: 'Room 8', location: 'Piętro I' },
    { name: 'Room 9', location: 'Piwnica' },
    { name: 'Room 10', location: 'Podwórze' },
    { name: 'Room 11', location: 'Piętro II' },
    { name: 'Room 12', location: 'Piwnica' },
    { name: 'Room 13', location: 'Piętro I' },
    { name: 'Room 14', location: 'Podwórze' },
    { name: 'Room 15', location: 'Piętro II' },
  ];
}
