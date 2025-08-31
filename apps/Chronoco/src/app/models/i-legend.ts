import { LegendType } from './legend-type.enum';

export interface ILegend {
  id: string;
  type: LegendType;
  positions: IInstancePosition[];
  name: string;
  description?: string;
}

export interface IInstancePosition {
  rooms: string[];
  startTime: Date;
  endTime: Date;
}

export interface IInstance {
  id: string;
  position: IInstancePosition;
  legendId: string;
  zIndex: number;
}

export interface IOperationalInstance {
  instance: IInstance;
  top: number,
  width: number,
  left: number,
  height: number,
}