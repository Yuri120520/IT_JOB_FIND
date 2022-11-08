import { name } from 'faker';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const TABLE_NAME = 'company_skill';
export class CreateCompanySkillTable1666545085446 implements MigrationInterface {
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
            name: 'company_id',
            type: 'uuid',
            isNullable: false
          },
          {
            name: 'skill_id',
            type: 'uuid',
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
        ],
        uniques: [{ columnNames: ['company_id', 'skill_id'], name: 'UNQ_company_id_skill_id' }],
        foreignKeys: [
          {
            columnNames: ['company_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'company',
            name: 'FK_company_id',
            onDelete: 'CASCADE'
          },
          {
            columnNames: ['skill_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'skill',
            name: 'FK_skill_id',
            onDelete: 'CASCADE'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
