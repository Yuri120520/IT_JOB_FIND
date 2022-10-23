import { getJoinRelation } from '@enouvo-packages/base-nestjs-api';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CompanyAddress } from './CompanyAddress';
import { CompanySkill } from './CompanySkill';
import { User } from './User';

import { CustomBaseEntity } from '@/common/base/baseEntity';
import { IUser } from '@/main/shared/user/interface';

@ObjectType({ isAbstract: true })
@Entity('company')
export class Company extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => ID)
  @Column()
  userId: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ nullable: true })
  website: string;

  @Field({ nullable: true })
  @Column()
  description: string;

  @Field(() => Number, { nullable: true })
  @Column({ type: 'int4' })
  size: number;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  benefits: JSON;

  @Field(() => [String], { nullable: true })
  @Column({ type: 'text', array: true, nullable: true })
  images: string[];

  @Field(() => [String], { nullable: true })
  @Column({ type: 'text', array: true, nullable: true })
  certificates: string[];

  @Field(() => [CompanyAddress])
  @OneToMany(() => CompanyAddress, cd => cd.company)
  @JoinColumn({ name: 'id' })
  companyAddresses: CompanyAddress[];

  @Field(() => [CompanySkill])
  @OneToMany(() => CompanySkill, ck => ck.company)
  @JoinColumn({ name: 'id' })
  companySkills: CompanySkill[];

  @Field(() => IUser)
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  static getRelations(info: GraphQLResolveInfo, withPagination?: boolean, forceInclude?: string[]): string[] {
    const fields = [
      ['companyAddresses'],
      ['companyAddresses', 'address'],
      ['companySkills'],
      ['companySkills', 'skill'],
      ['user']
    ];
    return getJoinRelation(info, fields, withPagination, forceInclude);
  }
}
