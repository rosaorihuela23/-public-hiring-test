import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Route,
  SuccessResponse,
} from "tsoa";
import { ProductCarbonFootprintService } from "./productCarbonFootprint.service";
import { CreateProductCarbonFootprintDto } from "./dto/createProductCarbonFootprint.dto";
import {
  ProductCarbonFootprintResponseDto,
  ProductCarbonFootprintSummaryDto,
} from "./dto/productCarbonFootprintResponse.dto";

@Route("product-carbon-footprint")
export class ProductCarbonFootprintController extends Controller {
  private service = new ProductCarbonFootprintService();

  @Post()
  @SuccessResponse(201)
  public async createProduct(
    @Body() body: CreateProductCarbonFootprintDto,
  ): Promise<ProductCarbonFootprintResponseDto> {
    try {
      return await this.service.createProduct(body);
    } catch (error: any) {
      this.setStatus(400);
      throw new Error(error.message);
    }
  }

  @Get()
  public async getAllProducts(): Promise<ProductCarbonFootprintSummaryDto[]> {
    return this.service.findAllProducts();
  }

  @Get("{id}")
  public async getProductById(
    @Path() id: number,
  ): Promise<ProductCarbonFootprintResponseDto> {
    const product = await this.service.findProductById(id);
    if (!product) {
      this.setStatus(404);
      throw new Error("Product not found");
    }
    return product;
  }

  @Delete("{id}")
  @SuccessResponse(204)
  public async deleteProduct(@Path() id: number): Promise<void> {
    const deleted = await this.service.deleteProduct(id);
    if (!deleted) {
      this.setStatus(404);
      throw new Error("Product not found");
    }
    this.setStatus(204);
  }
}
