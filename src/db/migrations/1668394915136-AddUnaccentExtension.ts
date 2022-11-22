import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUnaccentExtension1668394915136 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "unaccent"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP EXTENSION IF EXISTS "unaccent"`);
  }
}
