import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appSchedulerGenerateHoursCaptions',
})
export class SchedulerGenerateHoursCaptionsPipe implements PipeTransform {
  public transform(timeFrom: string, timeTo: string): string[] {
    const result: string[] = [];

    const [ fromHours, fromMinutes ] = timeFrom.split(':').map(Number);
    const [ toHours, toMinutes ] = timeTo.split(':').map(Number);

    const start = new Date();
    start.setHours(fromHours, fromMinutes, 0, 0);

    const end = new Date();
    end.setHours(toHours, toMinutes, 0, 0);

    const current = new Date(start);

    result.push(this.formatTime(current));

    while (current < end) {
      current.setHours(current.getHours() + 1);
      current.setMinutes(0);

      if (current < end) {
        result.push(this.formatTime(current));
      }
    }

    const lastFormatted = this.formatTime(end);

    if (result[result.length - 1] !== lastFormatted) {
      result.push(lastFormatted);
    }

    return result;
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
