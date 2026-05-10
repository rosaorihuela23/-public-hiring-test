import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProductCarbonFootprint } from "./productCarbonFootprint.entity";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";

@Entity("product_ingredients")
export class ProductIngredient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @ManyToOne(() => ProductCarbonFootprint, (product) => product.ingredients, {
    onDelete: "CASCADE",
  })
  product: ProductCarbonFootprint;

  @Column()
  ingredientName: string;

  @Column("float")
  quantity: number;

  @Column()
  unit!: string;

  @Column({ nullable: true })
  emissionFactorId: number | null;

  @ManyToOne(() => CarbonEmissionFactor, { nullable: true })
  emissionFactor: CarbonEmissionFactor | null;

  @Column({ type: "float", nullable: true })
  footprintKgCO2e: number | null;
}
