import { Component, input, InputSignal } from '@angular/core';
import { IRenderableBlock } from '@chronoco-fe/models/i-event-block';

@Component({
  selector: 'app-scheduler-grid-single-block',
  imports: [],
  templateUrl: './scheduler-grid-single-block.component.html',
  styleUrl: './scheduler-grid-single-block.component.css',
})
export class SchedulerGridSingleBlockComponent {
  public block: InputSignal<IRenderableBlock> = input.required();
}
