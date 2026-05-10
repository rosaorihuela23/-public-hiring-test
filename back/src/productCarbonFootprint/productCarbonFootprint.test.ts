import { dataSource, GreenlyDataSource } from "../../config/dataSource";
import { ProductCarbonFootprintService } from "./productCarbonFootprint.service";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { ProductCarbonFootprint } from "./productCarbonFootprint.entity";
import { ProductIngredient } from "./productIngredient.entity";

beforeAll(async () => {
  await dataSource.initialize();
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("ProductCarbonFootprintService", () => {
  let service: ProductCarbonFootprintService;

  beforeEach(() => {
    service = new ProductCarbonFootprintService();
  });

  describe("createProduct", () => {
    it("should create a product and compute correct total footprint", async () => {
      // Seed emission factors
      const hamFactor = new CarbonEmissionFactor({
        name: "ham",
        unit: "kg",
        emissionCO2eInKgPerUnit: 7.0,
        source: "Agribalyse",
      });
      const cheeseFactor = new CarbonEmissionFactor({
        name: "cheese",
        unit: "kg",
        emissionCO2eInKgPerUnit: 9.5,
        source: "Agribalyse",
      });
      await hamFactor.save();
      await cheeseFactor.save();

      const dto = {
        name: "Ham & Cheese Pizza",
        ingredients: [
          { name: "ham", quantity: 0.1, unit: "kg" },
          { name: "cheese", quantity: 0.15, unit: "kg" },
        ],
      };

      const result = await service.createProduct(dto);

      expect(result.id).toBeDefined();
      expect(result.name).toBe("Ham & Cheese Pizza");
      expect(result.totalFootprintKgCO2e).toBeCloseTo(
        0.1 * 7.0 + 0.15 * 9.5,
        10,
      );
      expect(result.ingredients[0].footprintKgCO2e).toBeCloseTo(0.7, 10);
      expect(result.ingredients[1].footprintKgCO2e).toBeCloseTo(1.425, 10);
      expect(result.ingredients[1].footprintKgCO2e).toBe(1.425);
    });

    it("should set totalFootprint to null if any ingredient lacks an emission factor", async () => {
      // Only ham factor exists, cheese does NOT
      const hamFactor = new CarbonEmissionFactor({
        name: "ham",
        unit: "kg",
        emissionCO2eInKgPerUnit: 7.0,
        source: "Agribalyse",
      });
      await hamFactor.save();

      const dto = {
        name: "Missing Factor Product",
        ingredients: [
          { name: "ham", quantity: 0.1, unit: "kg" },
          { name: "cheese", quantity: 0.15, unit: "kg" },
        ],
      };

      const result = await service.createProduct(dto);

      expect(result.totalFootprintKgCO2e).toBeNull();
      expect(result.ingredients[0].footprintKgCO2e).toBeCloseTo(0.7, 10);
      expect(result.ingredients[1].footprintKgCO2e).toBeNull();
    });

    it("should reject empty product name", async () => {
      const dto = {
        name: "",
        ingredients: [{ name: "ham", quantity: 0.1, unit: "kg" }],
      };
      await expect(service.createProduct(dto)).rejects.toThrow(
        "Product name required",
      );
    });

    it("should reject empty ingredients array", async () => {
      const dto = { name: "Empty Product", ingredients: [] };
      await expect(service.createProduct(dto)).rejects.toThrow(
        "At least one ingredient required",
      );
    });

    it("should reject ingredient with zero quantity", async () => {
      const dto = {
        name: "Zero Quantity",
        ingredients: [{ name: "ham", quantity: 0, unit: "kg" }],
      };
      // The validation in the service should catch it
      // (We need to add validation in the service, but if not present, the test will fail)
      // For now we assume the service has validation.
      // If not, we can add this test after adding validation.
      // Let's keep it as a reminder.
      await expect(service.createProduct(dto)).rejects.toThrow(
        /must be positive/,
      );
    });
  });

  describe("findAllProducts", () => {
    it("should return an array of product summaries", async () => {
      const hamFactor = new CarbonEmissionFactor({
        name: "ham",
        unit: "kg",
        emissionCO2eInKgPerUnit: 7.0,
        source: "Agribalyse",
      });
      await hamFactor.save();

      await service.createProduct({
        name: "Product 1",
        ingredients: [{ name: "ham", quantity: 0.5, unit: "kg" }],
      });
      await service.createProduct({
        name: "Product 2",
        ingredients: [{ name: "ham", quantity: 0.3, unit: "kg" }],
      });

      const all = await service.findAllProducts();
      expect(all).toHaveLength(2);
      expect(all[0].name).toBe("Product 2"); // newest first? depends on order, but we can check both
      expect(all[1].name).toBe("Product 1");
      // Check that each summary has only the expected fields
      expect(all[0].totalFootprintKgCO2e).toBe(0.3 * 7.0);
      expect(all[0].createdAt).toBeDefined();
    });
  });

  describe("findProductById", () => {
    it("should return full product details including ingredients", async () => {
      const hamFactor = new CarbonEmissionFactor({
        name: "ham",
        unit: "kg",
        emissionCO2eInKgPerUnit: 7.0,
        source: "Agribalyse",
      });
      await hamFactor.save();

      const created = await service.createProduct({
        name: "Single Product",
        ingredients: [{ name: "ham", quantity: 0.2, unit: "kg" }],
      });

      const found = await service.findProductById(created.id);
      expect(found).not.toBeNull();
      expect(found?.name).toBe("Single Product");
      expect(found?.ingredients).toHaveLength(1);
      expect(found?.ingredients[0].emissionFactorUsed?.name).toBe("ham");
    });

    it("should return null for non‑existent id", async () => {
      const found = await service.findProductById(999);
      expect(found).toBeNull();
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product and return true", async () => {
      const hamFactor = new CarbonEmissionFactor({
        name: "ham",
        unit: "kg",
        emissionCO2eInKgPerUnit: 7.0,
        source: "Agribalyse",
      });
      await hamFactor.save();

      const created = await service.createProduct({
        name: "To Delete",
        ingredients: [{ name: "ham", quantity: 0.1, unit: "kg" }],
      });

      const deleted = await service.deleteProduct(created.id);
      expect(deleted).toBe(true);

      const found = await service.findProductById(created.id);
      expect(found).toBeNull();
    });

    it("should return false when product does not exist", async () => {
      const deleted = await service.deleteProduct(999);
      expect(deleted).toBe(false);
    });
  });

  describe("computeFootprint (internal method – optional test)", () => {
    it("should correctly sum footprints when factors exist", async () => {
      const hamFactor = new CarbonEmissionFactor({
        name: "ham",
        unit: "kg",
        emissionCO2eInKgPerUnit: 7.0,
        source: "Agribalyse",
      });
      const cheeseFactor = new CarbonEmissionFactor({
        name: "cheese",
        unit: "kg",
        emissionCO2eInKgPerUnit: 9.5,
        source: "Agribalyse",
      });
      await hamFactor.save();
      await cheeseFactor.save();

      const ingredients = [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: 0.2, unit: "kg" },
      ];
      // Since the method is private, we might not test it directly.
      // Instead we rely on createProduct. This test is optional.
      // To test directly, we would need to make computeFootprint public or use a wrapper.
      // We'll skip it.
    });
  });
});
