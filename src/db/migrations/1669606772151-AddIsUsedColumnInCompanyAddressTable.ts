import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsUsedColumnInCompanyAddressTable1669606772151 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company_address" ADD COLUMN IF NOT EXISTS "is_used" boolean DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
