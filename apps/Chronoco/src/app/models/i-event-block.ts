import { EventBlockType } from './event-block-type.enum';

export interface IEventBlock {
  id: number;
  type: EventBlockType;
  positions: IEventBlockPosition[];
  name: string;
  color?: string;
}

export interface IEventBlockPosition {
  rooms: string[];
  startTime: string;
  endTime: string;
}

export interface IRenderableBlock {
  id: string;
  legendId: number;
  positionIndex: number;
  position: IEventBlockPosition;
  legend: IEventBlock;
}
