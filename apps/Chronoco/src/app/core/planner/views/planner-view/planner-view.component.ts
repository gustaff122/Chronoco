import { Component, inject } from '@angular/core';
import { SchedulerHeaderComponent } from './components/scheduler-header/scheduler-header.component';
import { SchedulerGridComponent } from './components/scheduler-grid/scheduler-grid.component';
import { SchedulerSidebarComponent } from './components/scheduler-sidebar/scheduler-sidebar.component';
import { IRoom } from '@chronoco-fe/models/i-room';
import { PlannersSocketService } from './services/planners-socket.service';
import { SchedulerGridScrollStore } from './stores/scheduler-grid-scroll.store';
import { SchedulerGridComponentStore } from './components/scheduler-grid/scheduler-grid.component.store';
import { SchedulerLegendStore } from './stores/scheduler-legend.store';
import { SchedulerInstancesStore } from './stores/scheduler-instances.store';
import { SchedulerGridInteractionsStore } from './stores/scheduler-grid-interactions/scheduler-grid-interactions.store';
import { SchedulerGridDayScrollingStore } from './stores/scheduler-grid-day-scrolling.store';
import { SchedulerGridListenersStore } from './stores/scheduler-grid-listeners.store';
import { SchedulerSearchStore } from './stores/scheduler-search.store';
import { SchedulerSearchScrollStore } from './stores/scheduler-search-scroll.store';
import { SchedulerPresenceStore } from './stores/scheduler-presence.store';

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
    PlannersSocketService,
    SchedulerPresenceStore,
  ],
})
export class PlannerViewComponent {
  private readonly socketService: PlannersSocketService = inject(PlannersSocketService);

  constructor() {
    this.socketService.init();
  }

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
