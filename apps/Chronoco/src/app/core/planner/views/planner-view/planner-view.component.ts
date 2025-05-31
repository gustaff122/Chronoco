import { Component } from '@angular/core';
import { IRoom, SchedulerGridComponent } from '@chronoco/scheduler';

@Component({
  selector: 'app-planner-view',
  imports: [
    SchedulerGridComponent,
  ],
  templateUrl: './planner-view.component.html',
  styleUrl: './planner-view.component.css',
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
