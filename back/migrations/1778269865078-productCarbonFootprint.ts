import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductCarbonFootprint1778269865078 implements MigrationInterface {
    name = 'ProductCarbonFootprint1778269865078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_ingredients" ("id" SERIAL NOT NULL, "productId" integer NOT NULL, "ingredientName" character varying NOT NULL, "quantity" double precision NOT NULL, "unit" character varying NOT NULL, "emissionFactorId" integer, "footprintKgCO2e" double precision, CONSTRAINT "PK_82b8cf241e3716a8d4682e79190" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_carbon_footprints" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "totalFootprintKgCO2e" double precision, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_44835671561a678a9a5c10ddbe0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_ingredients" ADD CONSTRAINT "FK_0c47e7d54540edb8171ebe4e775" FOREIGN KEY ("productId") REFERENCES "product_carbon_footprints"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_ingredients" ADD CONSTRAINT "FK_86f170eae6bce9ba6e83ea26dba" FOREIGN KEY ("emissionFactorId") REFERENCES "carbon_emission_factors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_ingredients" DROP CONSTRAINT "FK_86f170eae6bce9ba6e83ea26dba"`);
        await queryRunner.query(`ALTER TABLE "product_ingredients" DROP CONSTRAINT "FK_0c47e7d54540edb8171ebe4e775"`);
        await queryRunner.query(`DROP TABLE "product_carbon_footprints"`);
        await queryRunner.query(`DROP TABLE "product_ingredients"`);
    }

}
