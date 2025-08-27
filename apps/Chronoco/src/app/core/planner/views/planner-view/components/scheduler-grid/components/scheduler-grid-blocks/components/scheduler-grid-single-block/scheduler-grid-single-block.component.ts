import { Component, inject, input, InputSignal, Signal } from '@angular/core';
import { IRenderableBlock } from '@chronoco-fe/models/i-event-block';
import { DatePipe } from '@angular/common';
import { SchedulerBlockTypeColorPipe } from '@chronoco-fe/pipes/scheduler-block-type-color.pipe';
import { SchedulerSearchScrollStore } from '../../../../stores/scheduler-search-scroll.store';

@Component({
  selector: 'app-scheduler-grid-single-block',
  imports: [
    DatePipe,
    SchedulerBlockTypeColorPipe,
  ],
  templateUrl: './scheduler-grid-single-block.component.html',
  styleUrl: './scheduler-grid-single-block.component.css',
})
export class SchedulerGridSingleBlockComponent {
  public block: InputSignal<IRenderableBlock> = input.required();

  private readonly searchScrollStore: SchedulerSearchScrollStore = inject(SchedulerSearchScrollStore);

  public readonly currentFoundInstance: Signal<IRenderableBlock> = this.searchScrollStore.currentFoundInstance;

}
