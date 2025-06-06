import { Pipe, PipeTransform } from '@angular/core';
import { EventBlockType } from '../models/event-block-type.enum';

@Pipe({
  name: 'libSchedulerTranslateBlockType',
})
export class SchedulerTranslateBlockTypePipe implements PipeTransform {
  public transform(blockType: EventBlockType): string {
    switch (blockType) {
      case EventBlockType.COMPETITION:
        return 'Konkursy';
      case EventBlockType.CONCERT:
        return 'Koncerty';
      case EventBlockType.LECTURE:
        return 'Prelekcje';
      case EventBlockType.MOVIE:
        return 'Filmy';
      case EventBlockType.PANEL:
        return 'Panele';
      case EventBlockType.TECHNICAL:
        return 'Techniczne';
      case EventBlockType.OTHER:
        return 'Inne';
    }
  }
}
