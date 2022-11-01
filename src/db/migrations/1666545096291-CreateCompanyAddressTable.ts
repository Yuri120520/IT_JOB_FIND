import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const TABLE_NAME = 'company_address';
export class CreateCompanyAddressTable1666545096291 implements MigrationInterface {
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
            name: 'detail',
            type: 'text',
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
        foreignKeys: [
          {
            columnNames: ['company_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'company',
            name: 'FK_company_id',
            onDelete: 'CASCADE'
          }
        ],
        uniques: [{ columnNames: ['company_id', 'detail'], name: 'UNQ_company_id_detail' }]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}
