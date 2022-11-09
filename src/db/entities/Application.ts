import { getJoinRelation } from '@enouvo-packages/base-nestjs-api';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CV } from './CV';
import { UserJob } from './UserJob';

import { CustomBaseEntity } from '@/common/base/baseEntity';

export enum InterviewMethod {
  GOOGLE_MEET = 'Google Meet',
  MICROSOFT_TEAM = 'Microsoft Team',
  OFFLINE = 'Offline',
  OTHER = 'Other'
}

@ObjectType({ isAbstract: true })
export class InterViewEvent {
  @Field(() => InterviewMethod)
  method: InterviewMethod;

  @Field()
  address: string;
}
@ObjectType({ isAbstract: true })
export class InterviewResponse {
  @Field(() => Date)
  startTime: Date;

  @Field(() => Date)
  endTime: Date;

  @Field(() => [InterViewEvent])
  events: InterViewEvent[];
}
@ObjectType({ isAbstract: true })
export class ReplyApplication {
  @Field({ nullable: true })
  message: string;

  @Field(() => InterviewResponse, { nullable: true })
  interview: InterviewResponse;
}

@ObjectType({ isAbstract: true })
@Entity('application')
export class Application extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => ID)
  @Column()
  userJobId: string;

  @Field(() => ID)
  @Column()
  CVId: string;

  @Field({ nullable: true })
  @Column()
  description: string;

  @Field(() => Boolean, { defaultValue: false })
  @Column()
  isAccepted: boolean;

  @Field(() => ReplyApplication, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  replyData: ReplyApplication;

  @Field(() => UserJob)
  @OneToOne(() => UserJob)
  @JoinColumn({ name: 'user_job_id' })
  userJob: UserJob;

  @Field(() => CV)
  @ManyToOne(() => CV)
  @JoinColumn({ name: 'CV_id' })
  CV: CV;

  static getRelations(info: GraphQLResolveInfo, withPagination?: boolean, forceInclude?: string[]): string[] {
    const fields = [['CV'], ['CV', 'user'], ['userJob'], ['userJob', 'job']];
    return getJoinRelation(info, fields, withPagination, forceInclude);
  }
}
