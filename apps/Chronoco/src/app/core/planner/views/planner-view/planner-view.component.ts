import { Component } from '@angular/core';
import { SchedulerHeaderComponent } from './components/scheduler-header/scheduler-header.component';
import { SchedulerGridComponent } from './components/scheduler-grid/scheduler-grid.component';
import { SchedulerSidebarComponent } from './components/scheduler-sidebar/scheduler-sidebar.component';
import { IRoom } from '@chronoco-fe/models/i-room';
import { SchedulerInstancesStore } from './components/scheduler-grid/stores/scheduler-instances.store';
import { SchedulerLegendStore } from './components/scheduler-grid/stores/scheduler-legend.store';
import { SchedulerGridComponentStore } from './components/scheduler-grid/scheduler-grid.component.store';
import { SchedulerGridScrollStore } from './components/scheduler-grid/stores/scheduler-grid-scroll.store';
import { SchedulerGridInteractionsStore } from './components/scheduler-grid/stores/scheduler-grid-interactions/scheduler-grid-interactions.store';
import { SchedulerGridListenersStore } from './components/scheduler-grid/stores/scheduler-grid-listeners.store';
import { SchedulerGridDayScrollingStore } from './components/scheduler-grid/stores/scheduler-grid-day-scrolling.store';
import { SchedulerSearchStore } from './components/scheduler-grid/stores/scheduler-search.store';
import { SchedulerSearchScrollStore } from './components/scheduler-grid/stores/scheduler-search-scroll.store';

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
    SchedulerGridComponentStore,
    SchedulerLegendStore,
    SchedulerInstancesStore,
    SchedulerGridScrollStore,
    SchedulerGridInteractionsStore,
    SchedulerGridDayScrollingStore,
    SchedulerGridListenersStore,
    SchedulerSearchStore,
    SchedulerSearchScrollStore,
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
