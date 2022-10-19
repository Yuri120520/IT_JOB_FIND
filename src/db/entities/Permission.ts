import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

import { CustomBaseEntity } from '@/common/base/baseEntity';

@ObjectType({ isAbstract: true })
export class Permission extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field({ nullable: true })
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column()
  isActive: boolean;

  @Field({ nullable: true })
  @Column()
  description: string;
}
