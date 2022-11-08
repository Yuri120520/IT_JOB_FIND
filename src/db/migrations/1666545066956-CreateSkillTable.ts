import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const TABLE_NAME = 'skill';

const SKILL_DATA = [
  'Javascript',
  'Java',
  '.NET',
  'C#',
  'PHP',
  'Python',
  'C++',
  'iOS',
  'Android',
  'Mobile',
  'Flutter',
  'React Native',
  'Tester',
  'Product Manager',
  'Business Analyst',
  'Project Manager',
  'System Admin',
  'DevOps',
  'System Engineer',
  'Data Analyst',
  'Game',
  'Design',
  'Golang',
  'AWS',
  'Azure',
  'Cloud',
  'UI/UX',
  'HTML',
  'Unity',
  'Kotlin',
  'IT Security',
  'IT Support',
  'IT Help desk',
  'ERP',
  'Solution Architect',
  'Database',
  'NodeJs',
  'QA/QC',
  'ReactJS',
  'VueJS',
  'Angular',
  'WordPress',
  'Network',
  'AI',
  'Embedded'
];

export class CreateSkillTable1666545066956 implements MigrationInterface {
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
            name: 'name',
            type: 'varchar(255)',
            isNullable: false,
            isUnique: true
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

    await queryRunner.query(
      `INSERT INTO "${TABLE_NAME}" ("name") VALUES ${SKILL_DATA.map(item => `('${item}')`).join(',')}`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}
