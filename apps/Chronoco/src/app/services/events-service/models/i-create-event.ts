export interface ICreateEvent {
  name: string;
  subtitle?: string;
  dateFrom?: string;
  dateTo?: string;
  address?: string;
  maxCapacity?: number;
  approximatePrice?: string;
  description?: string;
}

export type IUpdateEvent = Partial<ICreateEvent>;

