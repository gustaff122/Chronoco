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
    // Usuń sprawdzenie konfliktu - pozwól na tworzenie nakładających się eventów
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

        // Usuń sprawdzenie konfliktu - pozwól na aktualizację do nakładających się pozycji
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
    dateTimeToIndex: (time: Date) => number,
  ): IRenderableBlock[] {
    return this._eventInstances().filter(instance => {
      const style = this.getPositionStyle(instance.position, dateTimeToIndex);
      return (
        x >= style.left &&
        x <= style.left + style.width &&
        y >= style.top &&
        y <= style.top + style.height
      );
    });
  }

  public hasConflict(
    position: IEventBlockPosition,
    excludeId?: string,
  ): boolean {
    return this._eventInstances().some(instance => {
      if (excludeId && instance.id === excludeId) return false;

      const roomsOverlap = position.rooms.some(r => instance.position.rooms.includes(r));
      if (!roomsOverlap) return false;

      const [ startA, endA ] = [ position.startTime, position.endTime ];
      const [ startB, endB ] = [ instance.position.startTime, instance.position.endTime ];

      // Porównanie dat - sprawdzamy czy okresy się nie nakładają
      return !(endA <= startB || startA >= endB);
    });
  }

  // Nowa metoda do sprawdzania konfliktów dla konkretnego eventu
  public getConflictingInstances(instanceId: string): IRenderableBlock[] {
    const targetInstance = this._eventInstances().find(instance => instance.id === instanceId);
    if (!targetInstance) return [];

    return this._eventInstances().filter(instance => {
      if (instance.id === instanceId) return false;

      const roomsOverlap = targetInstance.position.rooms.some(r => instance.position.rooms.includes(r));
      if (!roomsOverlap) return false;

      const [ startA, endA ] = [ targetInstance.position.startTime, targetInstance.position.endTime ];
      const [ startB, endB ] = [ instance.position.startTime, instance.position.endTime ];

      return !(endA <= startB || startA >= endB);
    });
  }

  // Metoda do sprawdzania czy dany event ma konflikty
  public hasConflictById(instanceId: string): boolean {
    return this.getConflictingInstances(instanceId).length > 0;
  }

  public getPositionStyle(
    position: IEventBlockPosition,
    dateTimeToIndex: (time: Date) => number,
  ) {
    const gridSizeX = this.gridStore.gridSizeX();
    const gridSizeY = this.gridStore.gridSizeY();

    const top = dateTimeToIndex(position.startTime) * gridSizeY;
    const height = (dateTimeToIndex(position.endTime) - dateTimeToIndex(position.startTime)) * gridSizeY;

    const roomIndexes = position.rooms.map(r => this.gridStore.rooms().findIndex(x => x.name === r));

    const left = Math.min(...roomIndexes) * gridSizeX;

    const width = roomIndexes.length * gridSizeX;

    return { top, height, left, width };
  }
}