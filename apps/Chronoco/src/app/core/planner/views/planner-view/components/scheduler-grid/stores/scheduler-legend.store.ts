import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { IEventBlock } from '@chronoco-fe/models/i-event-block';
import { EventBlockType } from '@chronoco-fe/models/event-block-type.enum';

@Injectable()
export class SchedulerLegendStore {
  private readonly _legendBlocks = signal<IEventBlock[]>([]);
  public readonly legendBlocks = this._legendBlocks.asReadonly();

  private readonly _selectedLegendBlock: WritableSignal<IEventBlock | null> = signal(null);
  public readonly selectedLegendBlock = this._selectedLegendBlock.asReadonly();

  private readonly _searchFilter: WritableSignal<string> = signal(null);
  public readonly searchFilter = this._searchFilter.asReadonly();

  private _nextLegendId = 1;

  public readonly filteredLegends: Signal<IEventBlock[]> = computed(() => {
    const filter = this._searchFilter();
    const blocks = this._legendBlocks();

    if (!filter) return blocks;

    const regex = new RegExp(filter, 'i');
    return blocks.filter(({ name }) => regex.test(name));
  });

  public search(phrase: string): void {
    this._searchFilter.set(phrase);
  }

  public createLegendDefinition(name: string, type: EventBlockType): void {
    const newLegend: IEventBlock = {
      id: this._nextLegendId++,
      type,
      positions: [],
      name,
    };

    this._legendBlocks.update(state => ([ ...state, newLegend ]));
  }

  public updateLegendDefinition(legendId: number, updates: Partial<Omit<IEventBlock, 'id'>>): void {
    this._legendBlocks.update(state => state.map(el => el.id === legendId ? { ...el, updates } : el));
  }

  public selectLegendForDrawing(legendId: number): void {
    const legend = this._legendBlocks().find(l => l.id === legendId);
    this._selectedLegendBlock.set(legend);
  }
}