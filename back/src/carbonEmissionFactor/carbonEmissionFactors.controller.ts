import { Body, Controller, Get, Post, Route } from "tsoa";
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "./carbonEmissionFactors.service";
import { CreateCarbonEmissionFactorDto } from "./dto/create-carbonEmissionFactor.dto";

@Route("carbon-emission-factors")
export class CarbonEmissionFactorsController extends Controller {
  private readonly carbonEmissionFactorService: CarbonEmissionFactorsService;

  constructor() {
    super();
    this.carbonEmissionFactorService = new CarbonEmissionFactorsService();
  }

  @Get()
  public async getCarbonEmissionFactors(): Promise<CarbonEmissionFactor[]> {
    console.log(
      `[carbon-emission-factors] [GET] CarbonEmissionFactor: getting all CarbonEmissionFactors`
    );
    return this.carbonEmissionFactorService.findAll();
  }

  @Post()
  public async createCarbonEmissionFactors(
    @Body() carbonEmissionFactors: CreateCarbonEmissionFactorDto[]
  ): Promise<CarbonEmissionFactor[] | null> {
    console.log(
      `[carbon-emission-factors] [POST] CarbonEmissionFactor: ${carbonEmissionFactors.length} items created`
    );
    return this.carbonEmissionFactorService.save(carbonEmissionFactors);
  }
}
