export interface IngredientInput {
  name: string;
  quantity: number;
  unit: string;
}

export interface CreateProductRequest {
  name: string;
  ingredients: IngredientInput[];
}

export interface ProductIngredient {
  name: string;
  quantity: number;
  unit: string;
  emissionFactorUsed: {
    id: number;
    name: string;
    unit: string;
    emissionCO2eInKgPerUnit: number;
    source: string;
  } | null;
  footprintKgCO2e: number | null;
}

export interface ProductDetail {
  id: number;
  name: string;
  totalFootprintKgCO2e: number | null;
  createdAt: string;
  ingredients: ProductIngredient[];
}

export interface ProductSummary {
  id: number;
  name: string;
  totalFootprintKgCO2e: number | null;
  createdAt: string;
}
