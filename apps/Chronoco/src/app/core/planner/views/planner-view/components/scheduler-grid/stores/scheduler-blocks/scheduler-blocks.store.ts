import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { IEventBlock, IEventBlockPosition, IRenderableBlock } from '@chronoco-fe/models/i-event-block';
import { EventBlockType } from '@chronoco-fe/models/event-block-type.enum';

@Injectable()
export class SchedulerBlocksStore {
  // Legend blocks - definicje typów eventów
  private readonly _legendBlocks = signal<IEventBlock[]>([]);
  private _nextLegendId = 1;

  // Aktualnie wybrany typ legendy do rysowania
  private readonly _selectedLegendBlock: WritableSignal<IEventBlock | null> = signal(null);
  public readonly selectedLegendBlock: Signal<IEventBlock | null> = this._selectedLegendBlock.asReadonly();

  // Instancje eventów na siatce
  private readonly _eventInstances = signal<IRenderableBlock[]>([]);
  private _nextInstanceId = 1;

  // Public readonly access
  public readonly legendBlocks = this._legendBlocks.asReadonly();
  public readonly eventInstances = this._eventInstances.asReadonly();
  public readonly filteredLegends: Signal<IEventBlock[]> = computed(() => {
    const filter = this.searchFilter();
    const blocks = this.legendBlocks();

    if (!filter) return blocks;

    const regex = new RegExp(filter, 'i');
    return blocks.filter(({ name }) => regex.test(name));
  });


  private readonly _searchFilter: WritableSignal<string> = signal(null);
  public readonly searchFilter: Signal<string> = this._searchFilter.asReadonly();

  public search(phrase: string): void {
    this._searchFilter.set(phrase);
  }

  /**
   * Tworzy nową definicję legendy (typ eventu)
   */
  public createLegendDefinition(
    name: string,
    type: EventBlockType,
    color?: string,
  ): IEventBlock {
    const newLegend: IEventBlock = {
      id: this._nextLegendId++,
      type,
      positions: [],
      name,
      color: color || this.getDefaultColorForType(type),
    };

    console.log(name, type);

    this._legendBlocks.set([ ...this._legendBlocks(), newLegend ]);
    return newLegend;
  }

  /**
   * Aktualizuje definicję legendy
   */
  public updateLegendDefinition(legendId: number, updates: Partial<Omit<IEventBlock, 'id'>>): boolean {
    const legends = this._legendBlocks();
    const legendIdx = legends.findIndex(l => l.id === legendId);

    if (legendIdx === -1) return false;

    const updatedLegend = { ...legends[legendIdx], ...updates };
    const updatedLegends = [ ...legends ];
    updatedLegends[legendIdx] = updatedLegend;

    this._legendBlocks.set(updatedLegends);
    return true;
  }

  /**
   * Usuwa definicję legendy i wszystkie jej instancje
   */
  public deleteLegendDefinition(legendId: number): boolean {
    const legends = this._legendBlocks();
    const filteredLegends = legends.filter(l => l.id !== legendId);

    if (filteredLegends.length === legends.length) return false;

    // Usuń też wszystkie instancje tego typu
    const instances = this._eventInstances();
    const filteredInstances = instances.filter(i => i.legendId !== legendId);
    this._eventInstances.set(filteredInstances);

    this._legendBlocks.set(filteredLegends);
    return true;
  }

  /**
   * Ustawia aktywną legendę do rysowania
   */
  public selectLegendForDrawing(legendId: number | null): boolean {
    if (legendId === null) {
      this._selectedLegendBlock.set(null);
      return true;
    }

    const legend = this._legendBlocks().find(l => l.id === legendId);
    if (!legend) return false;

    this._selectedLegendBlock.set(legend);
    return true;
  }

  /**
   * Tworzy nową instancję eventu na siatce (używając wybranej legendy)
   */
  public createEventInstance(position: IEventBlockPosition): IRenderableBlock | null {
    const selectedLegend = this._selectedLegendBlock();
    if (!selectedLegend) return null;

    // Sprawdź konflikty
    if (this.hasConflict(position)) return null;

    const newInstance: IRenderableBlock = {
      id: `instance-${this._nextInstanceId++}`,
      legendId: selectedLegend.id,
      positionIndex: 0, // Każda instancja ma jedną pozycję
      position,
      legend: selectedLegend,
    };

    this._eventInstances.set([ ...this._eventInstances(), newInstance ]);
    return newInstance;
  }

  /**
   * Aktualizuje pozycję instancji eventu
   */
  public updateEventInstance(instanceId: string, position: Partial<IEventBlockPosition>): boolean {
    const instances = this._eventInstances();
    const instanceIdx = instances.findIndex(i => i.id === instanceId);

    if (instanceIdx === -1) return false;

    const instance = instances[instanceIdx];
    const updatedPosition = { ...instance.position, ...position };

    // Sprawdź konflikty (z wyłączeniem tej samej instancji)
    if (this.hasConflict(updatedPosition, instanceId)) return false;

    const updatedInstance = { ...instance, position: updatedPosition };
    const updatedInstances = [ ...instances ];
    updatedInstances[instanceIdx] = updatedInstance;

    this._eventInstances.set(updatedInstances);
    return true;
  }

  /**
   * Usuwa instancję eventu
   */
  public deleteEventInstance(instanceId: string): boolean {
    const instances = this._eventInstances();
    const filteredInstances = instances.filter(i => i.id !== instanceId);

    if (filteredInstances.length === instances.length) return false;

    this._eventInstances.set(filteredInstances);
    return true;
  }

  /**
   * Duplikuje instancję eventu
   */
  public duplicateEventInstance(instanceId: string): IRenderableBlock | null {
    const instance = this.getEventInstance(instanceId);
    if (!instance) return null;

    // Przesuń duplikat o jedną godzinę w dół
    const newPosition = { ...instance.position };
    const [ h, m ] = newPosition.startTime.split(':').map(Number);
    const [ eh, em ] = newPosition.endTime.split(':').map(Number);

    newPosition.startTime = `${(h + 1).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    newPosition.endTime = `${(eh + 1).toString().padStart(2, '0')}:${em.toString().padStart(2, '0')}`;

    const newInstance: IRenderableBlock = {
      id: `instance-${this._nextInstanceId++}`,
      legendId: instance.legendId,
      positionIndex: 0,
      position: newPosition,
      legend: instance.legend,
    };

    this._eventInstances.set([ ...this._eventInstances(), newInstance ]);
    return newInstance;
  }

  /**
   * Pobiera instancję eventu po ID
   */
  public getEventInstance(instanceId: string): IRenderableBlock | null {
    return this._eventInstances().find(i => i.id === instanceId) || null;
  }

  /**
   * Pobiera definicję legendy po ID
   */
  public getLegendDefinition(legendId: number): IEventBlock | null {
    return this._legendBlocks().find(l => l.id === legendId) || null;
  }

  /**
   * Znajduje instancje eventów na danej pozycji
   */
  public findEventInstancesAtPosition(
    x: number,
    y: number,
    gridSizeX: number,
    gridSizeY: number,
    rooms: { name: string }[],
    timeToIndex: (time: string) => number,
  ): IRenderableBlock[] {
    return this._eventInstances().filter(instance => {
      const style = this.getPositionStyle(instance.position, gridSizeX, gridSizeY, rooms, timeToIndex);
      return (
        x >= style.left &&
        x <= style.left + style.width &&
        y >= style.top &&
        y <= style.top + style.height
      );
    });
  }

  /**
   * Sprawdza konflikty czasowo-przestrzenne
   */
  public hasConflict(
    position: IEventBlockPosition,
    excludeInstanceId?: string,
  ): boolean {
    return this._eventInstances().some(instance => {
      // Pomiń sprawdzaną instancję
      if (excludeInstanceId && instance.id === excludeInstanceId) {
        return false;
      }

      // Sprawdź nakładanie sal
      const hasRoomOverlap = position.rooms.some(room =>
        instance.position.rooms.includes(room),
      );

      if (!hasRoomOverlap) return false;

      // Sprawdź nakładanie czasu
      const posStart = position.startTime;
      const posEnd = position.endTime;
      const instStart = instance.position.startTime;
      const instEnd = instance.position.endTime;

      return !(posEnd <= instStart || posStart >= instEnd);
    });
  }

  /**
   * Oblicza style pozycjonowania
   */
  public getPositionStyle(
    position: IEventBlockPosition,
    gridSizeX: number,
    gridSizeY: number,
    rooms: { name: string }[],
    timeToIndex: (time: string) => number,
  ) {
    const top = timeToIndex(position.startTime) * gridSizeY;
    const height = (timeToIndex(position.endTime) - timeToIndex(position.startTime)) * gridSizeY;

    const roomIndexes = position.rooms
      .map((r) => rooms.findIndex(x => x.name === r))
      .filter(i => i !== -1);

    const left = Math.min(...roomIndexes) * gridSizeX;
    const width = roomIndexes.length * gridSizeX;

    return { top, height, left, width };
  }

  /**
   * Czyści wszystkie dane
   */
  public clearAll(): void {
    this._legendBlocks.set([]);
    this._eventInstances.set([]);
    this._selectedLegendBlock.set(null);
    this._nextLegendId = 1;
    this._nextInstanceId = 1;
  }

  /**
   * Eksportuje dane
   */
  public exportData() {
    return {
      legends: [ ...this._legendBlocks() ],
      instances: [ ...this._eventInstances() ],
    };
  }

  /**
   * Importuje dane
   */
  public loadData(data: { legends: IEventBlock[], instances: IRenderableBlock[] }): void {
    this._legendBlocks.set([ ...data.legends ]);
    this._eventInstances.set([ ...data.instances ]);

    if (data.legends.length > 0) {
      this._nextLegendId = Math.max(...data.legends.map(l => l.id)) + 1;
    }

    if (data.instances.length > 0) {
      const maxInstanceId = Math.max(...data.instances
        .map(i => parseInt(i.id.replace('instance-', '')))
        .filter(id => !isNaN(id)),
      );
      this._nextInstanceId = maxInstanceId + 1;
    }
  }

  private getDefaultColorForType(type: EventBlockType): string {
    const colorMap = {
      [EventBlockType.TECHNICAL]: '#3b82f6',
      [EventBlockType.OTHER]: '#10b981',
      [EventBlockType.CONCERT]: '#f59e0b',
      [EventBlockType.MOVIE]: '#6b7280',
      [EventBlockType.LECTURE]: '#6b7280',
      [EventBlockType.PANEL]: '#6b7280',
      [EventBlockType.COMPETITION]: '#6b7280',
    };
    return colorMap[type] || '#6b7280';
  }
}