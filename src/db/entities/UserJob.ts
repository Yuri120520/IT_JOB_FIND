import { getJoinRelation } from '@enouvo-packages/base-nestjs-api';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Application } from './Application';
import { Job } from './Job';
import { User } from './User';

import { CustomBaseEntity } from '@/common/base/baseEntity';
import { IUser } from '@/main/shared/user/interface';

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

  @Field(() => Boolean, { defaultValue: false })
  @Column()
  isFollowing: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @Column()
  isApplied: boolean;

  @Field(() => Job)
  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Field(() => IUser)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => Application, { nullable: true })
  @OneToOne(() => Application)
  @JoinColumn({ name: 'id' })
  application: Application;

  static getRelations(info: GraphQLResolveInfo, withPagination?: boolean, forceInclude?: string[]): string[] {
    const fields = [['job'], ['job', 'company'], ['user'], ['application'], ['application', 'CV']];
    return getJoinRelation(info, fields, withPagination, forceInclude);
  }
}
