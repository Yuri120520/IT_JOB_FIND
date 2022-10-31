import { getJoinRelation } from '@enouvo-packages/base-nestjs-api';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Job } from './Job';
import { Level } from './Level';

import { CustomBaseEntity } from '@/common/base/baseEntity';

@ObjectType({ isAbstract: true })
@Entity('job_level')
export class JobLevel extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => ID)
  @Column()
  jobId: string;

  @Field(() => ID)
  @Column()
  levelId: string;

  @Field(() => Job)
  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Field(() => Level)
  @ManyToOne(() => Level)
  @JoinColumn({ name: 'level_id' })
  level: Level;

  static getRelations(info: GraphQLResolveInfo, withPagination?: boolean, forceInclude?: string[]): string[] {
    const fields = [['job'], ['level']];
    return getJoinRelation(info, fields, withPagination, forceInclude);
  }
}
