import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { JobStatus, JobType } from '../entities/Job';

const TABLE_NAME = 'job';
export class CreateJobTable1667156604870 implements MigrationInterface {
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
            name: 'description',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'salary',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'year_of_experiences',
            type: 'integer',
            isArray: true,
            isNullable: true
          },
          {
            name: 'close_date',
            type: 'timestamp with time zone',
            isNullable: true
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.values(JobStatus),
            isNullable: true
          },
          {
            name: 'recruitment_process',
            type: 'text',
            isArray: true,
            isNullable: true
          },
          {
            name: 'types',
            type: 'enum',
            enum: Object.values(JobType),
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
            name: 'FK_company_id',
            columnNames: ['company_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'company',
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
