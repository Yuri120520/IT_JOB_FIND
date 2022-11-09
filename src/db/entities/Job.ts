import { getJoinRelation } from '@enouvo-packages/base-nestjs-api';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Company } from './Company';
import { JobAddress } from './JobAddress';
import { JobLevel } from './JobLevel';
import { JobSkill } from './JobSkill';
import { UserJob } from './UserJob';

import { CustomBaseEntity } from '@/common/base/baseEntity';
import { SalaryUnit } from '@/common/constant';

export enum JobType {
  FULL_TIME = 'Fulltime',
  PART_TIME = 'Part-time',
  REMOTE = 'Remote',
  FREELANCER = 'Freelancer'
}

export enum JobStatus {
  OPEN = 'Open',
  CLOSE = 'Closed',
  BLOCKED = 'Blocked'
}

@ObjectType({ isAbstract: true })
export class Salary {
  @Field(() => Boolean, { defaultValue: false })
  isNegotiable: boolean;

  @Field(() => Number, { nullable: true })
  max: number;

  @Field(() => Number, { nullable: true })
  min: number;

  @Field(() => SalaryUnit, { defaultValue: SalaryUnit.MONTH })
  unit: SalaryUnit;

  @Field({ defaultValue: 'USD' })
  currency: string;
}

@ObjectType({ isAbstract: true })
export class JobDescription {
  @Field()
  @Column()
  title: string;

  @Field(() => [String], { nullable: true })
  @Column('text', { array: true, nullable: true, default: [] })
  responsibilities: string[];

  @Field(() => [String])
  @Column('text', { array: true, nullable: true, default: [] })
  requirements: string[];
}
@ObjectType({ isAbstract: true })
@Entity('job')
export class Job extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => ID)
  @Column()
  companyId: string;

  @Field(() => JobDescription, { nullable: true })
  @Column({ type: 'jsonb', nullable: true, default: {} })
  description: JobDescription;

  @Field(() => Salary)
  @Column({ type: 'jsonb' })
  salary: Salary;

  @Field(() => [Number], { nullable: true })
  @Column({ type: 'integer', array: true, nullable: true, default: [] })
  yearOfExperiences: number[];

  @Field(() => Date)
  @Column()
  closeDate: Date;

  @Field(() => JobStatus, { defaultValue: JobStatus.OPEN })
  @Column({ type: 'enum', enum: JobStatus })
  status: JobStatus;

  @Field(() => [String], { nullable: true })
  @Column({ type: 'text', array: true, nullable: true, default: [] })
  recruitmentProcess: string[];

  @Field(() => [JobType], { nullable: true })
  @Column({ type: 'enum', array: true, enum: JobType, nullable: true })
  types: JobType[];

  @Field(() => [JobAddress], { nullable: true })
  @OneToMany(() => JobAddress, ja => ja.job)
  @JoinColumn({ name: 'id' })
  addresses: JobAddress[];

  @Field(() => [JobSkill], { nullable: true })
  @OneToMany(() => JobSkill, js => js.job)
  @JoinColumn({ name: 'id' })
  skills: JobSkill[];

  @Field(() => [JobLevel], { nullable: true })
  @OneToMany(() => JobLevel, jl => jl.job)
  @JoinColumn({ name: 'id' })
  levels: JobLevel[];

  @Field(() => Company)
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Field(() => [UserJob], { nullable: true })
  @OneToMany(() => UserJob, userJob => userJob.job)
  @JoinColumn({ name: 'id' })
  userJobs: UserJob[];

  static getRelations(info: GraphQLResolveInfo, withPagination?: boolean, forceInclude?: string[]): string[] {
    const fields = [
      ['company'],
      ['addresses'],
      ['addresses', 'address'],
      ['skills'],
      ['skills', 'skill'],
      ['levels'],
      ['levels', 'level'],
      ['userJobs'],
      ['userJobs', 'application']
    ];
    return getJoinRelation(info, fields, withPagination, forceInclude);
  }
}
