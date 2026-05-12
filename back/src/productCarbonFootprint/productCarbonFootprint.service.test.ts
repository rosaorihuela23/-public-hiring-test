import { ProductCarbonFootprintService } from "./productCarbonFootprint.service";
import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { ProductCarbonFootprint } from "./productCarbonFootprint.entity";
import { ProductIngredient } from "./productIngredient.entity";

const getOrCreateEmissionFactor = async (name: string, value: number) => {
  let factor = await dataSource
    .getRepository(CarbonEmissionFactor)
    .findOne({ where: { name } });
  if (!factor) {
    factor = new CarbonEmissionFactor({
      emissionCO2eInKgPerUnit: value,
      unit: "kg",
      name,
      source: "test",
    });
    await factor.save();
  }
  return factor;
};

let service: ProductCarbonFootprintService;
let hamFactor: CarbonEmissionFactor;
let cheeseFactor: CarbonEmissionFactor;

beforeAll(async () => {
  await dataSource.initialize();
  service = new ProductCarbonFootprintService();
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
  hamFactor = await getOrCreateEmissionFactor("ham", 7.0);
  cheeseFactor = await getOrCreateEmissionFactor("cheese", 9.5);
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("ProductCarbonFootprint.service", () => {
  it("should create a product with computed footprint", async () => {
    const dto = {
      name: "Pizza",
      ingredients: [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: 0.15, unit: "kg" },
      ],
    };

    const result = await service.createProduct(dto);

    expect(result.name).toBe("Pizza");
    expect(result.totalFootprintKgCO2e).toBeCloseTo(0.1 * 7.0 + 0.15 * 9.5, 5);
    expect(result.ingredients).toHaveLength(2);
    expect(result.ingredients[0].footprintKgCO2e).toBeCloseTo(0.7, 5);
    expect(result.ingredients[1].footprintKgCO2e).toBeCloseTo(1.425, 5);
  });

  it("should set totalFootprint null if an ingredient lacks emission factor", async () => {
    const dto = {
      name: "Incomplete Pizza",
      ingredients: [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "unknown", quantity: 0.2, unit: "kg" },
      ],
    };

    const result = await service.createProduct(dto);

    expect(result.totalFootprintKgCO2e).toBeNull();
    expect(result.ingredients[0].footprintKgCO2e).toBeCloseTo(0.7, 5);
    expect(result.ingredients[1].footprintKgCO2e).toBeNull();
  });

  it("should reject product with empty name", async () => {
    await expect(
      service.createProduct({
        name: "",
        ingredients: [{ name: "ham", quantity: 0.1, unit: "kg" }],
      }),
    ).rejects.toThrow("Product name required");
  });

  it("should reject product without ingredients", async () => {
    await expect(
      service.createProduct({ name: "No ingredients", ingredients: [] }),
    ).rejects.toThrow("At least one ingredient required");
  });

  it("should find all products sorted by creation date", async () => {
    await service.createProduct({
      name: "First",
      ingredients: [{ name: "ham", quantity: 0.1, unit: "kg" }],
    });
    await new Promise((resolve) => setTimeout(resolve, 10));
    await service.createProduct({
      name: "Second",
      ingredients: [{ name: "cheese", quantity: 0.2, unit: "kg" }],
    });

    const products = await service.findAllProducts();
    expect(products).toHaveLength(2);
    expect(products[0].name).toBe("Second");
    expect(products[1].name).toBe("First");
  });

  it("should find a product by id with full relations", async () => {
    const created = await service.createProduct({
      name: "Find Me",
      ingredients: [{ name: "ham", quantity: 0.05, unit: "kg" }],
    });

    const found = await service.findProductById(created.id);
    expect(found).not.toBeNull();
    expect(found?.name).toBe("Find Me");
    expect(found?.ingredients).toHaveLength(1);
    expect(found?.ingredients[0].name).toBe("ham");
    expect(found?.ingredients[0].emissionFactorUsed?.name).toBe("ham");
  });

  it("should return null when product not found", async () => {
    const found = await service.findProductById(9999);
    expect(found).toBeNull();
  });

  it("should delete a product", async () => {
    const created = await service.createProduct({
      name: "To Delete",
      ingredients: [{ name: "ham", quantity: 0.1, unit: "kg" }],
    });
    const deleted = await service.deleteProduct(created.id);
    expect(deleted).toBe(true);

    const found = await service.findProductById(created.id);
    expect(found).toBeNull();
  });

  it("should return false when deleting non-existent product", async () => {
    const deleted = await service.deleteProduct(9999);
    expect(deleted).toBe(false);
  });
});
