import { PasswordUtil } from '@/providers/password';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminAccount1670144446070 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = await PasswordUtil.generateHash('Admin@123');

    const adminRoleId = await queryRunner.query(`SELECT "role".id FROM "role" WHERE name='Admin'`);

    await queryRunner.query(
      `INSERT INTO "user" ("email","full_name","role_id","password") VALUES ('admin.it@gmail.com','Admin','${adminRoleId[0].id}','${password}')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
