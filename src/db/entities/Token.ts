import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CustomBaseEntity } from '@/common/base/baseEntity';

@ObjectType({ isAbstract: true })
@Entity('token')
export class Token extends CustomBaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  userId: string;

  @Field()
  @Column()
  refreshToken: string;

  @Field()
  @Column()
  accessToken: string;

  @Field({ nullable: true })
  @Column()
  lastUsed: Date;

  @Field({ nullable: true })
  @Column()
  email: string;
}
