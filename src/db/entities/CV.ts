import { getJoinRelation } from '@enouvo-packages/base-nestjs-api';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { IUser } from './../../main/shared/user/interface/index';
import { User } from './User';

import { CustomBaseEntity } from '@/common/base/baseEntity';

@ObjectType({ isAbstract: true })
@Entity('cv')
export class CV extends CustomBaseEntity {
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
  @Column()
  url: string;

  @Field(() => Boolean, { defaultValue: false })
  isUsed: boolean;

  @Field(() => IUser)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: IUser;

  static getRelations(info: GraphQLResolveInfo, withPagination?: boolean, forceInclude?: string[]): string[] {
    const fields = [['user']];
    return getJoinRelation(info, fields, withPagination, forceInclude);
  }
}
