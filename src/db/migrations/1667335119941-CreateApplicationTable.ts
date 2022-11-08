import { name } from 'faker';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const TABLE_NAME = 'application';
export class CreateApplicationTable1667335119941 implements MigrationInterface {
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
            name: 'job_id',
            type: 'uuid',
            isNullable: false
          },
          {
            name: 'CV_id',
            type: 'uuid',
            isNullable: false
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
            columnNames: ['job_id', 'CV_id'],
            name: 'UNQ_job_id_CV_id'
          }
        ],
        foreignKeys: [
          {
            columnNames: ['job_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'job',
            onDelete: 'CASCADE',
            name: 'FK_job_id'
          },
          {
            columnNames: ['CV_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'CV',
            onDelete: 'CASCADE',
            name: 'FK_CV_id'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}
