import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CustomBaseEntity } from '@/common/base/baseEntity';

@ObjectType({ isAbstract: true })
@Entity('company')
export class Company extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

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

  @Field(() => Boolean, { defaultValue: false })
  @Column()
  isActive: boolean;
}
