/* eslint-disable import/order */
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Company } from './Company';
import {} from './Skill';

import { CustomBaseEntity } from '@/common/base/baseEntity';
import { GraphQLResolveInfo } from 'graphql';
import { getJoinRelation } from '@enouvo-packages/base-nestjs-api';

@ObjectType({ isAbstract: true })
@Entity('company_address')
export class CompanyAddress extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => ID)
  @Column()
  companyId: string;

  @Field({ nullable: true })
  @Column()
  detail: string;

  @Field(() => Company)
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  static getRelations(info: GraphQLResolveInfo, withPagination?: boolean, forceInclude?: string[]): string[] {
    const fields = [['company']];
    return getJoinRelation(info, fields, withPagination, forceInclude);
  }
}
