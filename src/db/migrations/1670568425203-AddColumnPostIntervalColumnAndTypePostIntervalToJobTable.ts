import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnPostIntervalColumnAndTypePostIntervalToJobTable1670568425203 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
         DROP TYPE  IF EXISTS post_interval_enum  ;
    
        CREATE TYPE post_interval_enum AS ENUM (
            'one_month',
            'two_months',
            'three_months'
        );

       
        ALTER TABLE "job" 
          ADD COLUMN IF NOT EXISTS "post_interval" post_interval_enum NULL,
          ADD COLUMN IF NOT EXISTS "payment_url" TEXT NULL,
          ADD COLUMN IF NOT EXISTS "result_url" TEXT NULL;
            
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
