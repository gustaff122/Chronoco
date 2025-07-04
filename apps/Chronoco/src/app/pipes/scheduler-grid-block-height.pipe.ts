import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appSchedulerGridBlockHeight',
})
export class SchedulerGridBlockHeightPipe implements PipeTransform {
  public transform(timeFrom: Date, timeTo: Date, pxPerMinute = 1): number {
    if (!timeFrom || !timeTo) return 0;

    let diff = (timeTo.getTime() - timeFrom.getTime()) / 60000;

    if (diff < 0) {
      diff += 24 * 60;
    }

    return diff * pxPerMinute;
  }
}
