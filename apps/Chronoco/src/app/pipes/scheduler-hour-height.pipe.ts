import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appSchedulerHourHeight',
})
export class SchedulerHourHeightPipe implements PipeTransform {
  public transform(row: string, timeTo: string, pxPerMinute = 1): number {
    if (!row || !timeTo) return 0;

    const [ fromH, fromM ] = row.split(':').map(Number);
    const from = new Date(0, 0, 0, fromH, fromM);

    const nextHour = new Date(from);
    nextHour.setHours(from.getHours() + 1, 0, 0, 0);

    const [ toH, toM ] = timeTo.split(':').map(Number);
    const to = new Date(0, 0, 0, toH, toM);

    const slotEnd = nextHour < to ? nextHour : to;

    const diffInMinutes = Math.max(0, (slotEnd.getTime() - from.getTime()) / 60000);

    return diffInMinutes * pxPerMinute;
  }
}
