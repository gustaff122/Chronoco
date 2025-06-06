import { Component } from '@angular/core';
import { SchedulerSidebarBlocksListComponent } from './components/scheduler-sidebar-blocks-list/scheduler-sidebar-blocks-list.component';
import { EventBlockType } from '../models/event-block-type.enum';

@Component({
  selector: 'lib-scheduler-sidebar',
  imports: [
    SchedulerSidebarBlocksListComponent,
  ],
  templateUrl: './scheduler-sidebar.component.html',
  styleUrl: './scheduler-sidebar.component.css',
})
export class SchedulerSidebarComponent {

  protected readonly EventBlockType = EventBlockType;
}
