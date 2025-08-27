import { Component, computed, ElementRef, inject, OnDestroy, Signal, viewChild } from '@angular/core';
import { SchedulerGridSingleBlockComponent } from './components/scheduler-grid-single-block/scheduler-grid-single-block.component';
import { SchedulerGridComponentStore } from '../../scheduler-grid.component.store';
import { IRoom } from '@chronoco-fe/models/i-room';
import { IOperationalBlock, IRenderableBlock } from '@chronoco-fe/models/i-event-block';
import { SchedulerEventInstancesStore } from '../../stores/scheduler-event-instances.store';
import { SchedulerGridScrollStore } from '../../stores/scheduler-grid-scroll.store';
import { SchedulerGridInteractionsStore } from '../../stores/scheduler-grid-interactions/scheduler-grid-interactions.store';
import { SchedulerSearchStore } from '../../stores/scheduler-search.store';


@Component({
  selector: 'app-scheduler-grid-blocks',
  templateUrl: './scheduler-grid-blocks.component.html',
  styleUrls: [ './scheduler-grid-blocks.component.css' ],
  imports: [
    SchedulerGridSingleBlockComponent,
  ],
})
export class SchedulerGridBlocksComponent implements OnDestroy {
  public interactionContainer: Signal<ElementRef> = viewChild('interactionContainer');

  private readonly gridStore: SchedulerGridComponentStore = inject(SchedulerGridComponentStore);
  private readonly eventInstancesStore: SchedulerEventInstancesStore = inject(SchedulerEventInstancesStore);
  private readonly interactionsStore: SchedulerGridInteractionsStore = inject(SchedulerGridInteractionsStore);
  private readonly searchStore: SchedulerSearchStore = inject(SchedulerSearchStore);
  private readonly gridScrollStore: SchedulerGridScrollStore = inject(SchedulerGridScrollStore);

  public readonly rooms: Signal<IRoom[]> = this.gridStore.rooms;
  public readonly eventInstances: Signal<IRenderableBlock[]> = this.eventInstancesStore.eventInstances;

  public ngOnDestroy(): void {
    this.interactionsStore.cleanup();
  }

  public startSelectingHandler($event: MouseEvent): void {
    this.interactionsStore.startSelectingHandler($event);
  }

  public onBlockMouseMove($event: MouseEvent, block: IOperationalBlock): void {
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

      return {
        instance,
        ...this.eventInstancesStore.getPositionStyle(instance.position),
        opacity: search
          ? (instance.legend.name.toLowerCase().includes(search.toLowerCase()) ? '1' : '0.6')
          : '1',
      };
    });
  });
}
