import { getJoinRelation } from '@enouvo-packages/base-nestjs-api';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CompanyAddress } from './CompanyAddress';
import { Job } from './Job';

import { CustomBaseEntity } from '@/common/base/baseEntity';

@ObjectType({ isAbstract: true })
@Entity('job_address')
export class JobAddress extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => ID)
  @Column()
  jobId: string;

  @Field(() => ID)
  @Column()
  addressId: string;

  @Field(() => Job)
  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Field(() => CompanyAddress)
  @ManyToOne(() => CompanyAddress)
  @JoinColumn({ name: 'address_id' })
  address: CompanyAddress;

  static getRelations(info: GraphQLResolveInfo, withPagination?: boolean, forceInclude?: string[]): string[] {
    const fields = [['job'], ['address']];
    return getJoinRelation(info, fields, withPagination, forceInclude);
  }
}
