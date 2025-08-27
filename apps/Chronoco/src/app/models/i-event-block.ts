import { EventBlockType } from './event-block-type.enum';

export interface IEventBlock {
  id: string;
  type: EventBlockType;
  positions: IEventBlockPosition[];
  name: string;
  description?: string;
}

export interface IEventBlockPosition {
  rooms: string[];
  startTime: Date;
  endTime: Date;
}

export interface IRenderableBlock {
  id: string;
  position: IEventBlockPosition;
  legend: IEventBlock;
  zIndex: number;
}

export interface IOperationalBlock {
  instance: IRenderableBlock;
  top: number,
  width: number,
  left: number,
  height: number,
}