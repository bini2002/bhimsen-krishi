export interface Item {
  id: number;
  name: string;
  rate: number;
  quantity: number;
  type: string;
}

export interface ProductionDetails {
  mainProduction: string;
  sellingPrice: string;
  gradualCropProduction: string;
  gradualCropSalePrice: string;
}

export interface CostSheet {
  title: string;
  commodity: number;
  data: Item[];
  productionDetails: ProductionDetails;
}

export interface Commodity {
  id: number;
  createdAt: string;
  isActive: boolean;
  name: string;
  category: number;
  template: string | null;
}

export enum FinanceKeyType {
    FIXED_CAPITAL = "fixed-capital",
    WORKING_CAPITAL = "working-capital",
    FIXED_COST = "fixed-cost",
    WORKING_COST = "working-cost",
    PROFIT_LOSS = "profit-loss",
  }
  