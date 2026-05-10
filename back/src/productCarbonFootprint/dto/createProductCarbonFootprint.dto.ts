export interface IngredientDto {
  name: string;
  quantity: number;
  unit: string;
}

export interface CreateProductCarbonFootprintDto {
  name: string;
  ingredients: IngredientDto[];
}
