import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";
import { ProductIngredient } from "./productIngredient.entity";

@Entity("product_carbon_footprints")
export class ProductCarbonFootprint extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ type: "float", nullable: true })
  totalFootprintKgCO2e: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ProductIngredient, (ingredient) => ingredient.product, {
    cascade: true,
  })
  ingredients: ProductIngredient[];
}
