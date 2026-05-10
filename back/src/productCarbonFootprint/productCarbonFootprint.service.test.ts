import { ProductCarbonFootprintService } from "./productCarbonFootprint.service";
import { dataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { ProductCarbonFootprint } from "./productCarbonFootprint.entity";
import { ProductIngredient } from "./productIngredient.entity";

// Mock the entire dataSource module
jest.mock("../../config/dataSource", () => ({
  dataSource: {
    getRepository: jest.fn(),
    createQueryRunner: jest.fn(),
  },
}));

describe("ProductCarbonFootprintService (unit)", () => {
  let service: ProductCarbonFootprintService;
  let mockEmissionRepo: any;
  let mockProductRepo: any;
  let mockIngredientRepo: any;
  let mockQueryRunner: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock repositories
    mockEmissionRepo = {
      findOne: jest.fn(),
    };
    mockProductRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };
    mockIngredientRepo = {};

    // Setup dataSource.getRepository to return correct mocks
    (dataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === CarbonEmissionFactor) return mockEmissionRepo;
      if (entity === ProductCarbonFootprint) return mockProductRepo;
      if (entity === ProductIngredient) return mockIngredientRepo;
      return {};
    });

    // Mock queryRunner
    mockQueryRunner = {
      connect: jest.fn().mockResolvedValue(undefined),
      startTransaction: jest.fn().mockResolvedValue(undefined),
      commitTransaction: jest.fn().mockResolvedValue(undefined),
      rollbackTransaction: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
      manager: {
        save: jest.fn(),
      },
    };
    (dataSource.createQueryRunner as jest.Mock).mockReturnValue(
      mockQueryRunner,
    );

    service = new ProductCarbonFootprintService();
  });

  describe("computeFootprint (private – tested via createProduct)", () => {
    it("should compute total footprint when all factors exist", async () => {
      // Setup emission factor lookups
      mockEmissionRepo.findOne
        .mockResolvedValueOnce({ emissionCO2eInKgPerUnit: 7.0 }) // ham
        .mockResolvedValueOnce({ emissionCO2eInKgPerUnit: 9.5 }); // cheese

      const createDto = {
        name: "Pizza",
        ingredients: [
          { name: "ham", quantity: 0.1, unit: "kg" },
          { name: "cheese", quantity: 0.15, unit: "kg" },
        ],
      };

      // Mock product save
      const savedProduct = {
        id: 1,
        name: "Pizza",
        totalFootprintKgCO2e: 0.1 * 7.0 + 0.15 * 9.5,
        createdAt: new Date(),
      };
      mockQueryRunner.manager.save
        .mockResolvedValueOnce(savedProduct) // product save
        .mockResolvedValueOnce([]); // ingredients save

      const result = await service.createProduct(createDto);

      expect(mockEmissionRepo.findOne).toHaveBeenCalledTimes(2);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(2);
      expect(result.totalFootprintKgCO2e).toBe(0.1 * 7.0 + 0.15 * 9.5);
      expect(result.ingredients).toHaveLength(2);
      expect(result.ingredients[0].footprintKgCO2e).toBeCloseTo(0.7, 10);
      expect(result.ingredients[1].footprintKgCO2e).toBeCloseTo(1.425, 10);
      expect(result.totalFootprintKgCO2e).toBeCloseTo(
        0.1 * 7.0 + 0.15 * 9.5,
        10,
      );
    });

    it("should set totalFootprint null if any factor missing", async () => {
      mockEmissionRepo.findOne
        .mockResolvedValueOnce({ emissionCO2eInKgPerUnit: 7.0 }) // ham
        .mockResolvedValueOnce(null); // cheese missing

      const createDto = {
        name: "Incomplete",
        ingredients: [
          { name: "ham", quantity: 0.1, unit: "kg" },
          { name: "cheese", quantity: 0.15, unit: "kg" },
        ],
      };

      const savedProduct = {
        id: 2,
        name: "Incomplete",
        totalFootprintKgCO2e: null,
        createdAt: new Date(),
      };
      mockQueryRunner.manager.save
        .mockResolvedValueOnce(savedProduct)
        .mockResolvedValueOnce([]);

      const result = await service.createProduct(createDto);
      expect(result.totalFootprintKgCO2e).toBeNull();
      expect(result.ingredients[0].footprintKgCO2e).toBeCloseTo(0.7, 10);
      expect(result.ingredients[1].footprintKgCO2e).toBeNull();
    });
  });

  describe("createProduct validation", () => {
    it("should throw if product name empty", async () => {
      await expect(
        service.createProduct({ name: "", ingredients: [] }),
      ).rejects.toThrow("Product name required");
    });

    it("should throw if no ingredients", async () => {
      await expect(
        service.createProduct({ name: "Test", ingredients: [] }),
      ).rejects.toThrow("At least one ingredient required");
    });
  });

  describe("findAllProducts", () => {
    it("should return product summaries", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Pizza",
          totalFootprintKgCO2e: 4.125,
          createdAt: new Date(),
        },
        {
          id: 2,
          name: "Pasta",
          totalFootprintKgCO2e: null,
          createdAt: new Date(),
        },
      ];
      mockProductRepo.find.mockResolvedValue(mockProducts);

      const result = await service.findAllProducts();
      expect(mockProductRepo.find).toHaveBeenCalledWith({
        order: { createdAt: "DESC" },
      });
      expect(result).toHaveLength(2);
      expect(result[0].totalFootprintKgCO2e).toBe(4.125);
      expect(result[1].totalFootprintKgCO2e).toBeNull();
    });
  });

  describe("findProductById", () => {
    it("should return full product with relations", async () => {
      const mockProduct = {
        id: 1,
        name: "Pizza",
        totalFootprintKgCO2e: 4.125,
        createdAt: new Date(),
        ingredients: [
          {
            ingredientName: "ham",
            quantity: 0.1,
            unit: "kg",
            footprintKgCO2e: 0.7,
            emissionFactor: { name: "ham" },
          },
        ],
      };
      mockProductRepo.findOne.mockResolvedValue(mockProduct);

      const result = await service.findProductById(1);
      expect(mockProductRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ["ingredients", "ingredients.emissionFactor"],
      });
      expect(result).not.toBeNull();
      expect(result?.ingredients).toHaveLength(1);
    });

    it("should return null if product not found", async () => {
      mockProductRepo.findOne.mockResolvedValue(null);
      const result = await service.findProductById(999);
      expect(result).toBeNull();
    });
  });

  describe("deleteProduct", () => {
    it("should return true on successful deletion", async () => {
      mockProductRepo.delete.mockResolvedValue({ affected: 1 });
      const result = await service.deleteProduct(1);
      expect(result).toBe(true);
      expect(mockProductRepo.delete).toHaveBeenCalledWith(1);
    });

    it("should return false if no rows affected", async () => {
      mockProductRepo.delete.mockResolvedValue({ affected: 0 });
      const result = await service.deleteProduct(999);
      expect(result).toBe(false);
    });
  });

  describe("Transaction rollback on error", () => {
    it("should rollback if saving product fails", async () => {
      mockEmissionRepo.findOne.mockResolvedValue({
        emissionCO2eInKgPerUnit: 7.0,
      });
      mockQueryRunner.manager.save.mockRejectedValueOnce(new Error("DB error"));

      const createDto = {
        name: "Fail Product",
        ingredients: [{ name: "ham", quantity: 0.1, unit: "kg" }],
      };

      await expect(service.createProduct(createDto)).rejects.toThrow(
        "DB error",
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });
});
