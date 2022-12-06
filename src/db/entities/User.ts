import { getJoinRelation } from '@enouvo-packages/base-nestjs-api';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Company } from './Company';
import { Role } from './Role';
import { UserJob } from './UserJob';

import { CustomBaseEntity } from '@/common/base/baseEntity';
import { Gender } from '@/common/constant';

@ObjectType({ isAbstract: true })
@Entity('user')
export class User extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field({ nullable: true })
  @Column()
  fullName: string;

  @Field()
  @Column()
  email: string;

  @Field(() => Gender, { nullable: true })
  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Field()
  @Column()
  password: string;

  @Field({ nullable: true })
  @Column()
  avatar: string;

  @Field(() => ID)
  @Column()
  roleId: string;

  @Field({ nullable: true })
  @Column()
  googleId: string;

  @Field(() => Boolean, { defaultValue: false })
  @Column()
  isActive: boolean;

  @Field({ nullable: true })
  @Column()
  phoneNumber: string;

  @Field(() => Role)
  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Field(() => Company, { nullable: true })
  @OneToOne(() => Company, company => company.user)
  company: Company;

  @Field(() => [UserJob], { nullable: true })
  @OneToMany(() => UserJob, uj => uj.user)
  userJobs: UserJob[];

  static getRelations(info: GraphQLResolveInfo, withPagination?: boolean, forceInclude?: string[]): string[] {
    const fields = [
      ['role'],
      ['company'],
      ['company', 'companyAddresses'],
      ['userJobs'],
      ['userJobs', 'job'],
      ['userJobs', 'job', 'company'],
      ['userJobs', 'application'],
      ['userJobs', 'application', 'CV']
    ];
    return getJoinRelation(info, fields, withPagination, forceInclude);
  }
}
