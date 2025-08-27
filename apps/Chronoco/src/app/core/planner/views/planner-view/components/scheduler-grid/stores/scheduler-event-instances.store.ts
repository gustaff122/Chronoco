import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { IEventBlockPosition, IRenderableBlock } from '@chronoco-fe/models/i-event-block';
import { SchedulerGridComponentStore } from '../scheduler-grid.component.store';
import { ulid } from 'ulid';

@Injectable()
export class SchedulerEventInstancesStore {
  private readonly gridStore: SchedulerGridComponentStore = inject(SchedulerGridComponentStore);

  private readonly _eventInstances: WritableSignal<IRenderableBlock[]> = signal([]);

  public readonly eventInstances: Signal<IRenderableBlock[]> = this._eventInstances.asReadonly();

  public create(instance: Omit<IRenderableBlock, 'id' | 'zIndex'>): IRenderableBlock {
    const newInstance: IRenderableBlock = {
      ...instance,
      id: `instance-${ulid()}`,
      zIndex: this.eventInstances().length + 1,
    };

    this._eventInstances.update(instances => [ ...instances, newInstance ]);
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

  public updateZIndexes(instanceId: string): void {
    this._eventInstances.update((instances) => {
      const others = instances.filter(b => b.id !== instanceId)
        .sort((a, b) => a.zIndex - b.zIndex);

      const updatedOthers = others.map((b, i) => ({ ...b, zIndex: i + 1 }));

      const target = instances.find(b => b.id === instanceId)!;
      const updatedTarget = { ...target, zIndex: instances.length };

      return [ ...updatedOthers, updatedTarget ];
    });
  }

}