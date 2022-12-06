import { MigrationInterface, QueryRunner } from 'typeorm';
import { JobStatus } from '../entities/Job';

export class AddDefaultStatusForJobTable1669970447132 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "status" SET DEFAULT '${JobStatus.OPEN}' `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
