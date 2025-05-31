import { Component, inject, Signal } from '@angular/core';
import { SchedulerGridColumnCaptionComponent } from './components/scheduler-grid-column-caption/scheduler-grid-column-caption.component';
import { SchedulerGridComponentStore } from '../../scheduler-grid.component.store';
import { IRoom } from '../../../models/i-room';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroClock } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'lib-scheduler-grid-columns',
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
