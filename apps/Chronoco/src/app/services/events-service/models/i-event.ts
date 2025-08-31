export interface IEvent {
  id: string;
  name: string;
  subtitle?: string;
  dateFrom?: string;
  dateTo?: string;
  address?: string;
  maxCapacity?: number;
  approximatePrice?: string;
  description?: string;
}
