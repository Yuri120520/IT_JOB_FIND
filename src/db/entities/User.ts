import { getJoinRelation } from '@enouvo-packages/base-nestjs-api';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from './Role';

import { CustomBaseEntity } from '@/common/base/baseEntity';
import { Gender } from '@/common/constant';

@ObjectType({ isAbstract: true })
@Entity('user')
export class User extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  fullName: string;

  @Field()
  @Column()
  email: string;

  @Field(() => Gender)
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

  @Field(() => ID, { nullable: true })
  @Column()
  companyId: string;

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

  static getRelations(info: GraphQLResolveInfo, withPagination?: boolean, forceInclude?: string[]): string[] {
    const fields = [['role']];
    return getJoinRelation(info, fields, withPagination, forceInclude);
  }
}
