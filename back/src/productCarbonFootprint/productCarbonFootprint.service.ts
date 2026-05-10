import { dataSource } from "../../config/dataSource";
import { ProductCarbonFootprint } from "./productCarbonFootprint.entity";
import { ProductIngredient } from "./productIngredient.entity";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import {
  CreateProductCarbonFootprintDto,
  IngredientDto,
} from "./dto/createProductCarbonFootprint.dto";
import {
  ProductCarbonFootprintResponseDto,
  ProductCarbonFootprintSummaryDto,
} from "./dto/productCarbonFootprintResponse.dto";

export class ProductCarbonFootprintService {
  private productRepo = dataSource.getRepository(ProductCarbonFootprint);
  private ingredientRepo = dataSource.getRepository(ProductIngredient);
  private emissionRepo = dataSource.getRepository(CarbonEmissionFactor);

  async computeFootprint(ingredients: IngredientDto[]) {
    const details = [];
    for (const ing of ingredients) {
      const factor = await this.emissionRepo.findOne({
        where: { name: ing.name, unit: ing.unit },
      });
      const footprint = factor
        ? ing.quantity * factor.emissionCO2eInKgPerUnit
        : null;
      details.push({ emissionFactor: factor, footprint });
    }
    const total = details.every((d) => d.footprint !== null)
      ? details.reduce((sum, d) => sum + (d.footprint as number), 0)
      : null;
    return { totalFootprint: total, ingredientDetails: details };
  }

  async createProduct(
    dto: CreateProductCarbonFootprintDto,
  ): Promise<ProductCarbonFootprintResponseDto> {
    if (!dto.name?.trim()) throw new Error("Product name required");
    if (!dto.ingredients?.length)
      throw new Error("At least one ingredient required");
    for (const ing of dto.ingredients) {
      if (ing.quantity <= 0) {
        throw new Error(`Quantity for ${ing.name} must be positive`);
      }
    }
    const { totalFootprint, ingredientDetails } = await this.computeFootprint(
      dto.ingredients,
    );

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = new ProductCarbonFootprint();
      product.name = dto.name;
      product.totalFootprintKgCO2e = totalFootprint;
      const savedProduct = await queryRunner.manager.save(product);

      const productIngredients: ProductIngredient[] = [];
      for (let i = 0; i < dto.ingredients.length; i++) {
        const ing = dto.ingredients[i];
        const { emissionFactor, footprint } = ingredientDetails[i];
        const pi = new ProductIngredient();
        pi.productId = savedProduct.id;
        pi.product = savedProduct;
        pi.ingredientName = ing.name;
        pi.quantity = ing.quantity;
        pi.unit = ing.unit;
        pi.emissionFactorId = emissionFactor?.id ?? null;
        pi.emissionFactor = emissionFactor ?? null;
        pi.footprintKgCO2e = footprint;
        productIngredients.push(pi);
      }

      await queryRunner.manager.save(productIngredients);
      await queryRunner.commitTransaction();

      return this.buildResponse(savedProduct, productIngredients);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllProducts(): Promise<ProductCarbonFootprintSummaryDto[]> {
    const products = await this.productRepo.find({
      order: { createdAt: "DESC" },
    });
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      totalFootprintKgCO2e: p.totalFootprintKgCO2e,
      createdAt: p.createdAt,
    }));
  }

  async findProductById(
    id: number,
  ): Promise<ProductCarbonFootprintResponseDto | null> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ["ingredients", "ingredients.emissionFactor"],
    });
    if (!product) return null;
    return this.buildResponse(product, product.ingredients);
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await this.productRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private buildResponse(
    product: ProductCarbonFootprint,
    ingredients: ProductIngredient[],
  ): ProductCarbonFootprintResponseDto {
    return {
      id: product.id,
      name: product.name,
      totalFootprintKgCO2e: product.totalFootprintKgCO2e,
      createdAt: product.createdAt,
      ingredients: ingredients.map((ing) => ({
        name: ing.ingredientName,
        quantity: ing.quantity,
        unit: ing.unit,
        emissionFactorUsed: ing.emissionFactor,
        footprintKgCO2e: ing.footprintKgCO2e,
      })),
    };
  }
}
