import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const TABLE_NAME = 'job_level';
export class CreateJobLevelTable1667156635906 implements MigrationInterface {
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
            name: 'level_id',
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
        uniques: [{ columnNames: ['job_id', 'level_id'], name: 'UNQ_job_id_level_id' }],
        foreignKeys: [
          {
            columnNames: ['job_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'job',
            name: 'FK_job_id',
            onDelete: 'CASCADE'
          },
          {
            columnNames: ['level_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'level',
            name: 'FK_level_id',
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
