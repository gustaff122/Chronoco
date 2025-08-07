import { IEventBlockPosition } from '@chronoco-fe/models/i-event-block';
import { SchedulerEventInstancesStore } from '../../scheduler-event-instances.store';
import { SchedulerGridComponentStore } from '../../../scheduler-grid.component.store';

export interface IInteractionContext {
  activeInstanceId: string;
  originalPosition: IEventBlockPosition;

  eventInstancesStore: SchedulerEventInstancesStore;
  gridStore: SchedulerGridComponentStore;

  dateTimeToIndex(date: Date): number;

  indexToDateTime(index: number): Date;

  getTotalRows(): number;
}
