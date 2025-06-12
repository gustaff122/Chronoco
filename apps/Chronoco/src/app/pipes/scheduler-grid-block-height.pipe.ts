import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appSchedulerGridBlockHeight',
})
export class SchedulerGridBlockHeightPipe implements PipeTransform {
  public transform(timeFrom: string, timeTo: string, pxPerMinute = 1): number {
    if (!timeFrom || !timeTo) return 0;

    const [ startHour, startMinute ] = timeFrom.split(':').map(Number);
    const [ endHour, endMinute ] = timeTo.split(':').map(Number);

    const startDate = new Date(0, 0, 0, startHour, startMinute);
    const endDate = new Date(0, 0, 0, endHour, endMinute);

    let diff = (endDate.getTime() - startDate.getTime()) / 60000;

    if (diff < 0) {
      diff += 24 * 60;
    }

    return diff * pxPerMinute;
  }
}