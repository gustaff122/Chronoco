import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { IEventBlock } from '@chronoco-fe/models/i-event-block';
import { EventBlockType } from '@chronoco-fe/models/event-block-type.enum';
import { ulid } from 'ulid';
import { SchedulerSearchStore } from './scheduler-search.store';

@Injectable()
export class SchedulerLegendStore {
  private readonly _legendBlocks = signal<IEventBlock[]>([]);

  private readonly _selectedLegendBlock: WritableSignal<IEventBlock | null> = signal(null);
  public readonly selectedLegendBlock = this._selectedLegendBlock.asReadonly();

  private readonly searchStore: SchedulerSearchStore = inject(SchedulerSearchStore);

  public readonly filteredLegends: Signal<IEventBlock[]> = computed(() => {
    const filter = this.searchStore.searchFilter();
    const blocks = this._legendBlocks();

    if (!filter) return blocks;

    const regex = new RegExp(filter, 'i');
    return blocks.filter(({ name }) => regex.test(name));
  });


  public createLegendDefinition(name: string, type: EventBlockType, description: string): void {
    const newLegend: IEventBlock = {
      id: ulid(),
      type,
      positions: [],
      name,
      description,
    };

    this._legendBlocks.update(state => ([ ...state, newLegend ]));
  }

  public updateLegendDefinition(legendId: string, updates: Partial<Omit<IEventBlock, 'id'>>): void {
    this._legendBlocks.update(state => state.map(el => el.id === legendId ? { ...el, ...updates } : el));
  }

  public selectLegendForDrawing(legendId: string): void {
    const legend = this._legendBlocks().find(l => l.id === legendId);
    this._selectedLegendBlock.set(legend);
  }
}