import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appSchedulerDurationInMinutes',
})
export class DurationInMinutesPipe implements PipeTransform {
  public transform(startDate: Date | string | number, endDate: Date | string | number): number {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (isNaN(start) || isNaN(end)) return 0;

    const diffMs = end - start;
    return Math.floor(diffMs / 60000);
  }
}