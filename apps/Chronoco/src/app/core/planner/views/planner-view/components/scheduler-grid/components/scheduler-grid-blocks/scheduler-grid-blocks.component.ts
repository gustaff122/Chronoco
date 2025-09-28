import { Component, computed, ElementRef, inject, OnDestroy, Signal, viewChild } from '@angular/core';
import { SchedulerGridSingleBlockComponent } from './components/scheduler-grid-single-block/scheduler-grid-single-block.component';
import { SchedulerGridComponentStore } from '../../scheduler-grid.component.store';
import { IRoom } from '@chronoco-fe/models/i-room';
import { IInstance, IOperationalInstance } from '@chronoco-fe/models/i-legend';
import { SchedulerGridSingleBlockRemoveBtnComponent } from './components/scheduler-grid-single-block-remove-btn/scheduler-grid-single-block-remove-btn.component';
import { SchedulerInstancesStore } from '../../../../stores/scheduler-instances.store';
import { SchedulerGridInteractionsStore } from '../../../../stores/scheduler-grid-interactions/scheduler-grid-interactions.store';
import { SchedulerSearchStore } from '../../../../stores/scheduler-search.store';
import { SchedulerLegendStore } from '../../../../stores/scheduler-legend.store';
import { SchedulerGridScrollStore } from '../../../../stores/scheduler-grid-scroll.store';


@Component({
  selector: 'app-scheduler-grid-blocks',
  templateUrl: './scheduler-grid-blocks.component.html',
  styleUrls: [ './scheduler-grid-blocks.component.css' ],
  imports: [
    SchedulerGridSingleBlockComponent,
    SchedulerGridSingleBlockRemoveBtnComponent,
  ],
})
export class SchedulerGridBlocksComponent implements OnDestroy {
  public readonly interactionContainer: Signal<ElementRef> = viewChild('interactionContainer');

  private readonly gridStore: SchedulerGridComponentStore = inject(SchedulerGridComponentStore);
  private readonly instancesStore: SchedulerInstancesStore = inject(SchedulerInstancesStore);
  private readonly interactionsStore: SchedulerGridInteractionsStore = inject(SchedulerGridInteractionsStore);
  private readonly searchStore: SchedulerSearchStore = inject(SchedulerSearchStore);
  private readonly legendStore: SchedulerLegendStore = inject(SchedulerLegendStore);
  private readonly gridScrollStore: SchedulerGridScrollStore = inject(SchedulerGridScrollStore);

  public readonly rooms: Signal<IRoom[]> = this.gridStore.rooms;
  public readonly eventInstances: Signal<IInstance[]> = this.instancesStore.instances;

  public ngOnDestroy(): void {
    this.interactionsStore.cleanup();
  }

  public startSelectingHandler($event: MouseEvent): void {
    this.interactionsStore.startSelectingHandler($event);
  }

  public onBlockMouseMove($event: MouseEvent, block: IOperationalInstance): void {
    this.interactionsStore.onBlockMouseMove($event, block);
  }

  public onBlockMouseLeave($event: MouseEvent): void {
    this.interactionsStore.onBlockMouseLeave($event);
  }

  public stopScrollHandler(): void {
    this.gridScrollStore.stopAutoScroll();
  }

  constructor() {
    this.interactionsStore.interactionContainer = this.interactionContainer;
  }

  public readonly blockStyle = computed(() => {
    return this.eventInstances()?.map((instance) => {
      const search = this.searchStore.searchFilter()?.toLowerCase();
      const instanceLegend = this.legendStore.filteredLegends().find(({ id }) => id === instance.legendId);

      return {
        instance,
        ...this.instancesStore.getPositionStyle(instance.position),
        opacity: search
          ? (instanceLegend?.name.toLowerCase().includes(search.toLowerCase()) ? '1' : '0.6')
          : '1',
      };
    });
  });
}
