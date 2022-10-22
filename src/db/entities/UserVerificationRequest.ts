import { Field, ID, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CustomBaseEntity } from '@/common/base/baseEntity';
import { UserVerificationRequestType } from '@/common/constant';

@ObjectType({ isAbstract: true })
@Entity('user_verification_request')
export class UserVerificationRequest extends CustomBaseEntity {
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
  @CreateDateColumn()
  expirationTime: Date;

  @Field(() => UserVerificationRequestType)
  @Column({ type: 'enum', enum: UserVerificationRequestType })
  type: UserVerificationRequestType;
}
