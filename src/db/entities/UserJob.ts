import { getJoinRelation } from '@enouvo-packages/base-nestjs-api';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Job } from './Job';
import { User } from './User';

import { CustomBaseEntity } from '@/common/base/baseEntity';
import { IUser } from '@/main/shared/user/interface';

export enum UserJobStatus {
  FOLLOWING = 'Following',
  APPLIED = 'Applied'
}
@ObjectType({ isAbstract: true })
@Entity('user_job')
export class UserJob extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => ID)
  @Column()
  userId: string;

  @Field(() => ID)
  @Column()
  jobId: string;

  @Field(() => UserJobStatus)
  @Column({ type: 'enum', enum: UserJobStatus })
  status: UserJobStatus;

  @Field(() => Job)
  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Field(() => IUser)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  static getRelations(info: GraphQLResolveInfo, withPagination?: boolean, forceInclude?: string[]): string[] {
    const fields = [['job'], ['job', 'company'], ['user']];
    return getJoinRelation(info, fields, withPagination, forceInclude);
  }
}
