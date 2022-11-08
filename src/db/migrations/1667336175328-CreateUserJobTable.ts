import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { UserJobStatus } from '../entities/UserJob';

const TABLE_NAME = 'user_job';
export class CreateUserJobTable1667336175328 implements MigrationInterface {
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
            isNullable: false
          },
          {
            name: 'job_id',
            type: 'uuid',
            isNullable: false
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.values(UserJobStatus),
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
        uniques: [
          {
            columnNames: ['user_id', 'job_id'],
            name: 'UNQ_user_id_job_id'
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
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
            name: 'FK_user_id'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}
