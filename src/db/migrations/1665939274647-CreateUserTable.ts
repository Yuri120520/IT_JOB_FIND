import { Gender } from '@/common/constant';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const TABLE_NAME = 'user';
export class CreateUserTable1665939274647 implements MigrationInterface {
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
            name: 'email',
            type: 'varchar(255)',
            isNullable: false,
            isUnique: true
          },
          {
            name: 'password',
            type: 'varchar(255)',
            isNullable: true
          },
          {
            name: 'full_name',
            type: 'varchar(255)',
            isNullable: true
          },
          {
            name: 'phone_number',
            type: 'varchar(20)',
            isNullable: true
          },
          {
            name: 'gender',
            type: 'enum',
            enum: Object.values(Gender),
            isNullable: true
          },
          {
            name: 'avatar',
            type: 'text',
            isNullable: true
          },
          {
            name: 'role_id',
            type: 'uuid',
            isNullable: false
          },
          {
            name: 'google_id',
            type: 'varchar(255)',
            isNullable: true
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: 'false',
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
            columnNames: ['role_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'role',
            name: 'FK_role_id',
            onDelete: 'SET NULL'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}
