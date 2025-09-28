import { Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { IInstance, ILegend } from '@chronoco-fe/models/i-legend';
import { DatePipe } from '@angular/common';
import { SchedulerBlockTypeColorPipe } from '@chronoco-fe/pipes/scheduler-block-type-color.pipe';
import { TooltipDirective } from '@chronoco-fe/ui/tooltip/tooltip.directive';
import { DurationInMinutesPipe } from '@chronoco-fe/pipes/scheduler-duration-in-minutes.pipe';
import { SchedulerSearchScrollStore } from '../../../../../../stores/scheduler-search-scroll.store';
import { SchedulerLegendStore } from '../../../../../../stores/scheduler-legend.store';

@Component({
  selector: 'app-scheduler-grid-single-block',
  imports: [
    DatePipe,
    DurationInMinutesPipe,
    SchedulerBlockTypeColorPipe,
    TooltipDirective,
  ],
  templateUrl: './scheduler-grid-single-block.component.html',
  styleUrl: './scheduler-grid-single-block.component.css',
})
export class SchedulerGridSingleBlockComponent {
  public block: InputSignal<IInstance> = input.required();

  private readonly searchScrollStore: SchedulerSearchScrollStore = inject(SchedulerSearchScrollStore);
  private readonly legendStore: SchedulerLegendStore = inject(SchedulerLegendStore);

  public readonly legend: Signal<ILegend> = computed(() => this.legendStore.legendBlocks().find(({ id }) => id === this.block().legendId) || null);
  public readonly currentFoundInstance: Signal<IInstance> = this.searchScrollStore.currentFoundInstance;

  protected readonly Math = Math;
}
