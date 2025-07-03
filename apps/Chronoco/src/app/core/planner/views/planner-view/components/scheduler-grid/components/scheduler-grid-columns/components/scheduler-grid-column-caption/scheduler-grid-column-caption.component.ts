import { Component, input, InputSignal } from '@angular/core';
import { IRoom } from '@chronoco-fe/models/i-room';

@Component({
  selector: 'app-scheduler-grid-column-caption',
  imports: [],
  templateUrl: './scheduler-grid-column-caption.component.html',
  styleUrl: './scheduler-grid-column-caption.component.css',
})
export class SchedulerGridColumnCaptionComponent {
  public room: InputSignal<IRoom> = input.required();
}
