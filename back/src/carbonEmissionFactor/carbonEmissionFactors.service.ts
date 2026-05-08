import { dataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CreateCarbonEmissionFactorDto } from "./dto/create-carbonEmissionFactor.dto";

export class CarbonEmissionFactorsService {
  async findAll(): Promise<CarbonEmissionFactor[]> {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    const repository = dataSource.getRepository(CarbonEmissionFactor);
    return repository.find();
  }

  async save(
    carbonEmissionFactor: CreateCarbonEmissionFactorDto[]
  ): Promise<CarbonEmissionFactor[] | null> {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    const repository = dataSource.getRepository(CarbonEmissionFactor);
    return repository.save(carbonEmissionFactor);
  }
}
