import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appSchedulerGenerateHoursCaptions',
})
export class SchedulerGenerateHoursCaptionsPipe implements PipeTransform {
  public transform(timeFrom: Date, timeTo: Date): string[] {
    if (!timeFrom || !timeTo) return [];

    const result: string[] = [];
    const current = new Date(timeFrom);

    result.push(this.formatTime(current));

    while (current < timeTo) {
      current.setHours(current.getHours() + 1, 0, 0, 0);

      if (current < timeTo) {
        result.push(this.formatTime(current));
      }
    }

    const lastFormatted = this.formatTime(timeTo);
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
