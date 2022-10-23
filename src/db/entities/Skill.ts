import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CustomBaseEntity } from '@/common/base/baseEntity';

@ObjectType({ isAbstract: true })
@Entity('skill')
export class Skill extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  name: string;
}
