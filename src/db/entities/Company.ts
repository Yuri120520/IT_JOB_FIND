import { getJoinRelation } from '@enouvo-packages/base-nestjs-api';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CompanyAddress } from './CompanyAddress';
import { CompanySkill } from './CompanySkill';
import { Job } from './Job';
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

  @Field({ nullable: true })
  @Column({ nullable: true })
  website: string;

  @Field({ nullable: true })
  @Column()
  description: string;

  @Field(() => Number, { nullable: true })
  @Column({ type: 'int4' })
  size: number;

  @Field(() => [String], { nullable: true })
  @Column({ type: 'text', array: true, nullable: true })
  benefits: string[];

  @Field(() => [String], { nullable: true })
  @Column({ type: 'text', array: true, nullable: true })
  images: string[];

  @Field(() => [String], { nullable: true })
  @Column({ type: 'text', array: true, nullable: true })
  certificates: string[];

  @Field(() => [CompanyAddress], { nullable: true })
  @OneToMany(() => CompanyAddress, cd => cd.company)
  companyAddresses: CompanyAddress[];

  @Field(() => [CompanySkill], { nullable: true })
  @OneToMany(() => CompanySkill, ck => ck.company)
  companySkills: CompanySkill[];

  @Field(() => IUser)
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => [Job], { nullable: true })
  @OneToMany(() => Job, job => job.company)
  @JoinColumn({ name: 'id' })
  jobs: Job[];

  static getRelations(info: GraphQLResolveInfo, withPagination?: boolean, forceInclude?: string[]): string[] {
    const fields = [
      ['companyAddresses'],
      ['companyAddresses', 'address'],
      ['companySkills'],
      ['companySkills', 'skill'],
      ['user'],
      ['jobs'],
      ['jobs', 'company'],
      ['jobs', 'addresses'],
      ['jobs', 'addresses', 'address']
    ];
    return getJoinRelation(info, fields, withPagination, forceInclude);
  }
}
