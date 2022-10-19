import { UserVerificationRequestType } from '@/common/constant';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const TABLE_NAME = 'user_verification_request';
export class CreateUserVerificationRequestTable1665932952160 implements MigrationInterface {
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
            name: 'code',
            type: 'varchar(255)',
            isNullable: false
          },
          {
            name: 'data',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'expiration_time',
            type: 'timestamp with time zone'
          },
          {
            name: 'type',
            type: 'enum',
            enum: Object.values(UserVerificationRequestType)
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}
