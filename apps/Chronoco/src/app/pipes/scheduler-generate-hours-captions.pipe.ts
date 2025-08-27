import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appSchedulerGenerateHoursCaptions',
})
export class SchedulerGenerateHoursCaptionsPipe implements PipeTransform {
  public transform(timeFrom: Date, timeTo: Date): { time: string; fullTime: string }[] {
    if (!timeFrom || !timeTo) return [];

    const result: { time: string; fullTime: string }[] = [];
    const current = new Date(timeFrom);

    result.push(this.formatObject(current));

    while (current < timeTo) {
      current.setHours(current.getHours() + 1, 0, 0, 0);

      if (current < timeTo) {
        result.push(this.formatObject(current));
      }
    }

    const lastFormatted = this.formatObject(timeTo);
    if (result[result.length - 1].fullTime !== lastFormatted.fullTime) {
      result.push(lastFormatted);
    }

    return result;
  }

  private formatObject(date: Date): { time: string; fullTime: string } {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return {
      time: `${hours}:${minutes}`,
      fullTime: date.toLocaleString('sv-SE').replace(' ', 'T'),
    };
  }
}
