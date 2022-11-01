import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const TABLE_NAME = 'company';
export class CreateCompanyTable1665939284647 implements MigrationInterface {
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
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
            isUnique: true
          },
          {
            name: 'name',
            type: 'varchar(255)',
            isNullable: false
          },
          {
            name: 'website',
            type: 'varchar(255)',
            isNullable: true
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true
          },
          {
            name: 'size',
            type: 'integer',
            isNullable: true
          },
          {
            name: 'benefits',
            type: 'text',
            isArray: true,
            isNullable: true
          },
          {
            name: 'images',
            type: 'text',
            isArray: true,
            isNullable: true
          },
          {
            name: 'certificates',
            type: 'text',
            isArray: true,
            isNullable: true
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
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            name: 'FK_user_id',
            onDelete: 'CASCADE'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}
