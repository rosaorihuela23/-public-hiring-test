export interface CarbonEmissionFactor {
  id: number;
  name: string;
  unit: string;
  emissionCO2eInKgPerUnit: number;
  source: string;
}

export interface CreateCarbonEmissionFactorDto {
  name: string;
  unit: string;
  emissionCO2eInKgPerUnit: number;
  source: string;
}
