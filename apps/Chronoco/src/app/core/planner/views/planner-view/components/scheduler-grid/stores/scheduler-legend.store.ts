import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ILegend } from '@chronoco-fe/models/i-legend';
import { LegendType } from '@chronoco-fe/models/legend-type.enum';
import { ulid } from 'ulid';
import { SchedulerSearchStore } from './scheduler-search.store';

@Injectable()
export class SchedulerLegendStore {
  private readonly _legendBlocks: WritableSignal<ILegend[]> = signal([]);
  public readonly legendBlocks: Signal<ILegend[]> = this._legendBlocks.asReadonly();

  private readonly _selectedLegendBlock: WritableSignal<ILegend> = signal(null);
  public readonly selectedLegendBlock = this._selectedLegendBlock.asReadonly();

  private readonly searchStore: SchedulerSearchStore = inject(SchedulerSearchStore);

  public readonly filteredLegends: Signal<ILegend[]> = computed(() => {
    const filter = this.searchStore.searchFilter();
    const blocks = this._legendBlocks();

    if (!filter) return blocks;

    const regex = new RegExp(filter, 'i');
    return blocks.filter(({ name }) => regex.test(name));
  });


  public createLegendDefinition(name: string, type: LegendType, description: string): void {
    const newLegend: ILegend = {
      id: ulid(),
      type,
      positions: [],
      name,
      description,
    };

    this._legendBlocks.update(state => ([ ...state, newLegend ]));
  }

  public updateLegendDefinition(legendId: string, updates: Partial<Omit<ILegend, 'id'>>): void {
    this._legendBlocks.update(state => state.map(el => el.id === legendId ? { ...el, ...updates } : el));

    console.log(this._legendBlocks());
  }

  public selectLegendForDrawing(legendId: string): void {
    const legend = this._legendBlocks().find(l => l.id === legendId);
    this._selectedLegendBlock.set(legend);
  }
}