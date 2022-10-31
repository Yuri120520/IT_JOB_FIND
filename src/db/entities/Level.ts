import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CustomBaseEntity } from '@/common/base/baseEntity';

@ObjectType({ isAbstract: true })
@Entity('level')
export class Level extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  name: string;
}
