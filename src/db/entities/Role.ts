import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

import { CustomBaseEntity } from '@/common/base/baseEntity';
import { ROLE } from '@/common/constant';

@ObjectType({ isAbstract: true })
export class Role extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => ROLE)
  @Column({ type: 'enum', enum: ROLE })
  name: ROLE;
}
