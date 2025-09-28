import { IInstancePosition } from '@chronoco-fe/models/i-legend';
import { SchedulerInstancesStore } from '../../scheduler-instances.store';
import { SchedulerGridComponentStore } from '../../../components/scheduler-grid/scheduler-grid.component.store';

export interface IInteractionContext {
  activeInstanceId: string;
  originalPosition: IInstancePosition;

  instancesStore: SchedulerInstancesStore;
  gridStore: SchedulerGridComponentStore;

  dateTimeToIndex(date: Date): number;

  indexToDateTime(index: number): Date;

  getTotalRows(): number;
}
