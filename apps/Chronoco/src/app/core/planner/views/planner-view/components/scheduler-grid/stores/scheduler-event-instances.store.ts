import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { IEventBlockPosition, IRenderableBlock } from '@chronoco-fe/models/i-event-block';
import { SchedulerGridComponentStore } from '../scheduler-grid.component.store';

@Injectable()
export class SchedulerEventInstancesStore {
  private readonly gridStore: SchedulerGridComponentStore = inject(SchedulerGridComponentStore);

  private readonly _eventInstances: WritableSignal<IRenderableBlock[]> = signal([]);
  private _nextInstanceId = 1;

  public readonly eventInstances: Signal<IRenderableBlock[]> = this._eventInstances.asReadonly();

  public create(instance: Omit<IRenderableBlock, 'id' | 'positionIndex'>): IRenderableBlock {
    const newInstance: IRenderableBlock = {
      ...instance,
      id: `instance-${this._nextInstanceId++}`,
      positionIndex: 0,
    };

    this._eventInstances.set([ ...this._eventInstances(), newInstance ]);
    return newInstance;
  }

  public update(instanceId: string, position: Partial<IEventBlockPosition>): void {
    this._eventInstances.update(instances => {
      return instances.map(instance => {
        if (instance.id !== instanceId) return instance;
        const updatedPosition = { ...instance.position, ...position };

        return { ...instance, position: updatedPosition };
      });
    });
  }

  public delete(instanceId: string): void {
    this._eventInstances.update(state => (state.filter(instance => instance.id !== instanceId)));
  }

  public findAtPosition(
    x: number,
    y: number,
  ): IRenderableBlock[] {
    return this._eventInstances().filter(instance => {
      const style = this.getPositionStyle(instance.position);
      return (
        x >= style.left &&
        x <= style.left + style.width &&
        y >= style.top &&
        y <= style.top + style.height
      );
    });
  }

  public getPositionStyle(
    position: IEventBlockPosition,
  ) {
    const gridSizeX = this.gridStore.gridSizeX();
    const gridSizeY = this.gridStore.gridSizeY();

    const top = this.gridStore.dateTimeToIndex(position.startTime) * gridSizeY;
    const height = (this.gridStore.dateTimeToIndex(position.endTime) - this.gridStore.dateTimeToIndex(position.startTime)) * gridSizeY;

    const roomIndexes = position.rooms.map(r => this.gridStore.rooms().findIndex(x => x.name === r));

    const left = Math.min(...roomIndexes) * gridSizeX;

    const width = roomIndexes.length * gridSizeX;

    return { top, height, left, width };
  }
}