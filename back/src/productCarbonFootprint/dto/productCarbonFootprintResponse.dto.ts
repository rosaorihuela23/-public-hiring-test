import { CarbonEmissionFactor } from "../../carbonEmissionFactor/carbonEmissionFactor.entity";
export interface IngredientFootprintDto {
  name: string;
  quantity: number;
  unit: string;
  emissionFactorUsed: CarbonEmissionFactor | null;
  footprintKgCO2e: number | null;
}

export interface ProductCarbonFootprintResponseDto {
  id: number;
  name: string;
  totalFootprintKgCO2e: number | null;
  createdAt: Date;
  ingredients: IngredientFootprintDto[];
}

export interface ProductCarbonFootprintSummaryDto {
  id: number;
  name: string;
  totalFootprintKgCO2e: number | null;
  createdAt: Date;
}
