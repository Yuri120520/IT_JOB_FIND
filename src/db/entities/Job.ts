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
import { MAX_SALARY } from '@/common/constant';

export enum JobType {
  FULL_TIME = 'Fulltime',
  PART_TIME = 'Part-time',
  REMOTE = 'Remote',
  FREELANCER = 'Freelancer'
}

export enum JobStatus {
  DRAFT = 'Draft',
  OPEN = 'Open',
  CLOSED = 'Closed',
  BLOCKED = 'Blocked',
  DELETED = 'Deleted'
}

export enum PostInterval {
  MONTH = 'one_month',
  TWO_MONTHS = 'two_months',
  THREE_MONTHS = 'three_months'
}

@ObjectType({ isAbstract: true })
export class Salary {
  @Field(() => Boolean, { defaultValue: false })
  isNegotiable: boolean;

  @Field(() => Number, { defaultValue: MAX_SALARY })
  max: number;

  @Field(() => Number, { defaultValue: 0 })
  min: number;
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

  @Field(() => PostInterval, { nullable: true })
  @Column({ type: 'enum', enum: PostInterval, nullable: true })
  postInterval: PostInterval;

  @Field({ nullable: true })
  @Column()
  paymentUrl: string;

  @Field({ nullable: true })
  @Column()
  resultUrl: string;

  static getRelations(info: GraphQLResolveInfo, withPagination?: boolean, forceInclude?: string[]): string[] {
    const fields = [
      ['company'],
      ['company', 'user'],
      ['addresses'],
      ['addresses', 'address'],
      ['skills'],
      ['skills', 'skill'],
      ['levels'],
      ['levels', 'level'],
      ['userJobs'],
      ['userJobs', 'application'],
      ['userJobs', 'application', 'CV'],
      ['userJobs', 'user']
    ];
    return getJoinRelation(info, fields, withPagination, forceInclude);
  }
}
