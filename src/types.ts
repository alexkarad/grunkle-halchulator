export interface ItemMapping {
  id: number;
  name: string;
  members: boolean;
  limit?: number;
  highalch?: number;
  icon: string;
}

export interface LatestPrice {
  high: number | null;
  highTime: number | null;
  low: number | null;
  lowTime: number | null;
}

export type LatestPricesById = Record<number, LatestPrice>;

export interface ProfitRow {
  id: number;
  name: string;
  members: boolean;
  icon: string;
  buyPrice: number;
  highAlch: number;
  buyLimit: number | null;
  profitPerItem: number;
  totalPotentialProfit: number | null;
}
