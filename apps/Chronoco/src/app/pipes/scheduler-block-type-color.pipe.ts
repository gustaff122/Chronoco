import { Pipe, PipeTransform } from '@angular/core';
import { EventBlockType } from '../models/event-block-type.enum';

@Pipe({
  name: 'appSchedulerBlockTypeColor',
})
export class SchedulerBlockTypeColorPipe implements PipeTransform {
  public transform(blockType: EventBlockType): string {
    switch (blockType) {
      case EventBlockType.COMPETITION:
        return 'bg-emerald-400';
      case EventBlockType.CONCERT:
        return 'bg-pink-400';
      case EventBlockType.LECTURE:
        return 'bg-blue-400';
      case EventBlockType.MOVIE:
        return 'bg-cyan-400';
      case EventBlockType.PANEL:
        return 'bg-orange-400';
      case EventBlockType.TECHNICAL:
        return 'bg-red-400';
      case EventBlockType.OTHER:
        return 'bg-violet-400';
    }
  }
}
