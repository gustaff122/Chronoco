import { Component, input, InputSignal } from '@angular/core';
import { IEventBlock } from '../../../../../models/i-event-block';

@Component({
  selector: 'lib-scheduler-grid-single-block',
  imports: [],
  templateUrl: './scheduler-grid-single-block.component.html',
  styleUrl: './scheduler-grid-single-block.component.css',
})
export class SchedulerGridSingleBlockComponent {
  public block: InputSignal<IEventBlock> = input.required();
}
