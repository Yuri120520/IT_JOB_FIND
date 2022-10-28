import { ROLE } from '@/common/constant';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const TABLE_NAME = 'role';
export class CreateRoleTable1665932851717 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAME,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
            isPrimary: true
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()'
          }
        ]
      })
    );
    await queryRunner.query(`
        INSERT INTO "role" ("name") VALUES ('${ROLE.ADMIN}'),('${ROLE.EMPLOYER}'),('${ROLE.USER}')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}
