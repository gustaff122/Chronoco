import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { IInstance, IInstancePosition } from '@chronoco-fe/models/i-legend';
import { SchedulerGridComponentStore } from '../scheduler-grid.component.store';
import { ulid } from 'ulid';

@Injectable()
export class SchedulerInstancesStore {
  private readonly gridStore: SchedulerGridComponentStore = inject(SchedulerGridComponentStore);

  private readonly _instances: WritableSignal<IInstance[]> = signal([]);

  public readonly instances: Signal<IInstance[]> = this._instances.asReadonly();

  public create(instance: Omit<IInstance, 'id' | 'zIndex'>): IInstance {
    const newInstance: IInstance = {
      ...instance,
      id: `instance-${ulid()}`,
      zIndex: this.instances().length + 1,
    };

    this._instances.update(instances => [ ...instances, newInstance ]);
    return newInstance;
  }

  public update(instanceId: string, position: Partial<IInstancePosition>): void {
    this._instances.update(instances => {
      return instances.map(instance => {
        if (instance.id !== instanceId) return instance;
        const updatedPosition = { ...instance.position, ...position };

        return { ...instance, position: updatedPosition };
      });
    });
  }

  public delete(instanceId: string): void {
    this._instances.update(state => (state.filter(instance => instance.id !== instanceId)));
  }

  public findAtPosition(
    x: number,
    y: number,
  ): IInstance[] {
    return this._instances().filter(instance => {
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
    position: IInstancePosition,
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
    this._instances.update((instances) => {
      const others = instances
        .filter(b => b.id !== instanceId)
        .sort((a, b) => a.zIndex - b.zIndex);

      const zIndexMap = new Map<string, number>(
        others.map((b, i) => [ b.id, i + 1 ]),
      );

      zIndexMap.set(instanceId, instances.length);

      return instances.map(b => ({
        ...b,
        zIndex: zIndexMap.get(b.id)!,
      }));
    });
  }

}