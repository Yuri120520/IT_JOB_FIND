import { getJoinRelation } from '@enouvo-packages/base-nestjs-api';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CV } from './CV';
import { Job } from './Job';

import { CustomBaseEntity } from '@/common/base/baseEntity';

@ObjectType({ isAbstract: true })
@Entity('application')
export class Application extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => ID)
  @Column()
  jobId: string;

  @Field(() => ID)
  @Column()
  CVId: string;

  @Field(() => Boolean, { defaultValue: false })
  @Column()
  isAccepted: boolean;

  @Field(() => Job)
  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Field(() => CV)
  @ManyToOne(() => CV)
  @JoinColumn({ name: 'CV_id' })
  CV: CV;

  static getRelations(info: GraphQLResolveInfo, withPagination?: boolean, forceInclude?: string[]): string[] {
    const fields = [['CV'], ['CV', 'user'], ['job'], ['job', 'company']];
    return getJoinRelation(info, fields, withPagination, forceInclude);
  }
}
