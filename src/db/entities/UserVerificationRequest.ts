import { Field, ID, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

import { CustomBaseEntity } from '@/common/base/baseEntity';
import { UserVerificationRequestType } from '@/common/constant';

@ObjectType({ isAbstract: true })
export class Permission extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  email: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'jsonb' })
  data: JSON;

  @Field()
  @Column()
  code: string;

  @Field(() => Date)
  @Column({ type: 'datetime' })
  expirationTime: Date;

  @Field(() => UserVerificationRequestType)
  @Column({ type: 'enum', enum: UserVerificationRequestType })
  type: UserVerificationRequestType;
}
