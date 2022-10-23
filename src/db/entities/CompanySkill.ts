import { getJoinRelation } from '@enouvo-packages/base-nestjs-api';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Company } from './Company';
import { Skill } from './Skill';

import { CustomBaseEntity } from '@/common/base/baseEntity';

@ObjectType({ isAbstract: true })
@Entity('company_skill')
export class CompanySkill extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => ID)
  @Column()
  companyId: string;

  @Field(() => ID)
  @Column()
  skillId: string;

  @Field(() => Skill)
  @ManyToOne(() => Skill)
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;

  @Field(() => Company)
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  static getRelations(info: GraphQLResolveInfo, withPagination?: boolean, forceInclude?: string[]): string[] {
    const fields = [['skill'], ['company']];
    return getJoinRelation(info, fields, withPagination, forceInclude);
  }
}
