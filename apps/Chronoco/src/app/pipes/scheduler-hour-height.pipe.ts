import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appSchedulerHourHeight',
})
export class SchedulerHourHeightPipe implements PipeTransform {
  public transform(row: string, timeFrom: Date, timeTo: Date, pxPerMinute = 1): number {

    const [ fromH, fromM ] = row.split(':').map(Number);

    const from = new Date(timeFrom);
    from.setHours(fromH, fromM, 0, 0);

    const nextHour = new Date(from);
    nextHour.setHours(from.getHours() + 1, 0, 0, 0);

    const slotEnd = nextHour < timeTo ? nextHour : timeTo;

    const diffInMinutes = Math.max(0, (slotEnd.getTime() - from.getTime()) / 60000);

    return diffInMinutes * pxPerMinute;
  }
}
