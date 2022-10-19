import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CustomBaseEntity } from './../../common/base/baseEntity';
import { Role } from './Role';

@ObjectType({ isAbstract: true })
export class Permission extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => ID)
  @Column()
  roleId: string;

  @Field(() => ID)
  @Column()
  permissionId: string;

  @Field(() => Role)
  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Field(() => Permission)
  @ManyToOne(() => Permission)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;

  static getRelations(info: GraphQLResolveInfo, withPagination?: boolean, forceInclude?: string[]): string[] {
    const fields = [['role'], ['permission']];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return getJoinRelation(info, fields, withPagination, forceInclude);
  }
}
