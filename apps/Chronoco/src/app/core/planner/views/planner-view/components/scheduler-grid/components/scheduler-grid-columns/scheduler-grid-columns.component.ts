import { Component, inject, Signal } from '@angular/core';
import { SchedulerGridColumnCaptionComponent } from './components/scheduler-grid-column-caption/scheduler-grid-column-caption.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroClock } from '@ng-icons/heroicons/outline';
import { SchedulerGridComponentStore } from '../../scheduler-grid.component.store';
import { IRoom } from '@chronoco-fe/models/i-room';

@Component({
  selector: 'app-scheduler-grid-columns',
  imports: [
    SchedulerGridColumnCaptionComponent,
    NgIcon,
  ],
  templateUrl: './scheduler-grid-columns.component.html',
  styleUrl: './scheduler-grid-columns.component.css',
  viewProviders: [ provideIcons({ heroClock }) ],
})
export class SchedulerGridColumnsComponent {
  private readonly gridComponentStore: SchedulerGridComponentStore = inject(SchedulerGridComponentStore);

  public readonly rooms: Signal<IRoom[]> = this.gridComponentStore.rooms;
}
