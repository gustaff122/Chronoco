import { Pipe, PipeTransform } from '@angular/core';
import { LegendType } from '@chronoco-fe/models/legend-type.enum';

@Pipe({
  name: 'appSchedulerTranslateBlockType',
})
export class SchedulerTranslateBlockTypePipe implements PipeTransform {
  public transform(blockType: LegendType): string {
    switch (blockType) {
      case LegendType.COMPETITION:
        return 'Konkursy';
      case LegendType.CONCERT:
        return 'Koncerty';
      case LegendType.LECTURE:
        return 'Prelekcje';
      case LegendType.MOVIE:
        return 'Filmy';
      case LegendType.PANEL:
        return 'Panele';
      case LegendType.TECHNICAL:
        return 'Techniczne';
      case LegendType.OTHER:
        return 'Inne';
    }
  }
}
