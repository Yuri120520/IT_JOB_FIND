import { AbstractBaseEntity, getJoinRelation } from '@enouvo-packages/base-nestjs-api';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@ObjectType({ isAbstract: true })
export class CustomBaseEntity extends AbstractBaseEntity {
  @Field({ nullable: true })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  updateTimestampBeforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  updateTimestampBeforeUpdate() {
    this.updatedAt = new Date();
  }
  static getRelations(info: GraphQLResolveInfo, withPagination?: boolean, forceInclude?: string[]): string[] {
    const fields = [];

    return getJoinRelation(info, fields, withPagination, forceInclude);
  }
}
