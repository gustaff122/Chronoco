import { Pipe, PipeTransform } from '@angular/core';
import { LegendType } from '@chronoco-fe/models/legend-type.enum';

@Pipe({
  name: 'appSchedulerBlockTypeColor',
})
export class SchedulerBlockTypeColorPipe implements PipeTransform {
  public transform(blockType: LegendType): string {
    switch (blockType) {
      case LegendType.COMPETITION:
        return 'bg-emerald-300';
      case LegendType.CONCERT:
        return 'bg-pink-300';
      case LegendType.LECTURE:
        return 'bg-blue-300';
      case LegendType.MOVIE:
        return 'bg-cyan-300';
      case LegendType.PANEL:
        return 'bg-orange-300';
      case LegendType.TECHNICAL:
        return 'bg-red-300';
      case LegendType.OTHER:
        return 'bg-violet-300';
    }
  }
}

@Pipe({
  name: 'appSchedulerBlockTypeColorIntense',
})
export class SchedulerBlockTypeColorIntensePipe implements PipeTransform {
  public transform(blockType: LegendType): string {
    switch (blockType) {
      case LegendType.COMPETITION:
        return 'bg-emerald-400';
      case LegendType.CONCERT:
        return 'bg-pink-400';
      case LegendType.LECTURE:
        return 'bg-blue-400';
      case LegendType.MOVIE:
        return 'bg-cyan-400';
      case LegendType.PANEL:
        return 'bg-orange-400';
      case LegendType.TECHNICAL:
        return 'bg-red-400';
      case LegendType.OTHER:
        return 'bg-violet-400';
    }
  }
}

