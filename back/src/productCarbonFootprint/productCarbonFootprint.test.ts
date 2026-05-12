import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { ProductCarbonFootprint } from "./productCarbonFootprint.entity";
import { ProductIngredient } from "./productIngredient.entity";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";

let chickenEmissionFactor: CarbonEmissionFactor;
let sampleProduct: ProductCarbonFootprint;

beforeAll(async () => {
  await dataSource.initialize();
  chickenEmissionFactor = new CarbonEmissionFactor({
    emissionCO2eInKgPerUnit: 5.0,
    unit: "kg",
    name: "chicken",
    source: "Agrybalise",
  });
  await chickenEmissionFactor.save();
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
  await chickenEmissionFactor.save();

  sampleProduct = new ProductCarbonFootprint();
  sampleProduct.name = "Vegan Pizza";
  sampleProduct.totalFootprintKgCO2e = null;
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("ProductCarbonFootprint Entity", () => {
  it("should create a new product with given properties", () => {
    const product = new ProductCarbonFootprint();
    product.name = "Pizza";
    product.totalFootprintKgCO2e = 12.5;
    expect(product.name).toBe("Pizza");
    expect(product.totalFootprintKgCO2e).toBe(12.5);
  });

  it("should allow null totalFootprintKgCO2e", () => {
    const product = new ProductCarbonFootprint();
    product.name = "Valid Name";
    product.totalFootprintKgCO2e = null;
    expect(product.totalFootprintKgCO2e).toBeNull();
  });
});

describe("ProductIngredient Entity", () => {
  it("should create an ingredient with correct relations", () => {
    const ingredient = new ProductIngredient();
    ingredient.ingredientName = "cheese";
    ingredient.quantity = 0.2;
    ingredient.unit = "kg";
    ingredient.product = sampleProduct;
    ingredient.emissionFactorId = chickenEmissionFactor.id;

    expect(ingredient.ingredientName).toBe("cheese");
    expect(ingredient.quantity).toBe(0.2);
    expect(ingredient.unit).toBe("kg");
    expect(ingredient.product).toBe(sampleProduct);
    expect(ingredient.emissionFactorId).toBe(chickenEmissionFactor.id);
  });

  it("should allow null footprint when emission factor is missing", () => {
    const ingredient = new ProductIngredient();
    ingredient.ingredientName = "mystery";
    ingredient.quantity = 0.3;
    ingredient.unit = "kg";
    ingredient.emissionFactorId = null;
    ingredient.footprintKgCO2e = null;

    expect(ingredient.footprintKgCO2e).toBeNull();
  });
});
