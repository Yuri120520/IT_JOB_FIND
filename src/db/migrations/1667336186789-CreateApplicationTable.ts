import { name } from 'faker';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const TABLE_NAME = 'application';
export class CreateApplicationTable1667336186789 implements MigrationInterface {
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
            name: 'user_job_id',
            type: 'uuid',
            isNullable: false
          },
          {
            name: 'cv_id',
            type: 'uuid',
            isNullable: false
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true
          },
          {
            name: 'reply_data',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'is_accepted',
            type: 'boolean',
            default: false
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
        uniques: [
          {
            columnNames: ['user_job_id'],
            name: 'UNQ_user_job_id'
          }
        ],
        foreignKeys: [
          {
            columnNames: ['user_job_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user_job',
            onDelete: 'CASCADE',
            name: 'FK_user_job_id'
          },
          {
            columnNames: ['cv_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'cv',
            onDelete: 'CASCADE',
            name: 'FK_cv_id'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}
