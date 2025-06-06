import { Pipe, PipeTransform } from '@angular/core';
import { IEventBlock } from '../models/i-event-block';
import { IRoom } from '../models/i-room';

@Pipe({
  name: 'libSchedulerGridBlockCssParams',
})
export class SchedulerGridBlockCssPipe implements PipeTransform {
  public transform(
    block: IEventBlock,
    rooms: IRoom[],
    gridSizeX: number = 144,
    gridSizeY: number = 60,
    scheduleStart = '00:00',
  ): Record<string, string> {
    const roomName = block.rooms[0];
    const roomIndex = rooms.findIndex(room => room.name === roomName);

    const startMinutes = this.getMinutesSince(block.startTime, scheduleStart);
    const endMinutes = this.getMinutesSince(block.endTime, scheduleStart);
    const duration = endMinutes - startMinutes;

    return {
      '--x': `${roomIndex * gridSizeX}px`,
      '--y': `${(startMinutes / 15) * gridSizeY}px`,
      '--w': `${gridSizeX}px`,
      '--h': `${(duration / 15) * gridSizeY}px`,
    };
  }

  private getMinutesSince(time: string, base: string): number {
    const [ h1, m1 ] = time.split(':').map(Number);
    const [ h2, m2 ] = base.split(':').map(Number);
    return (h1 * 60 + m1) - (h2 * 60 + m2);
  }
}