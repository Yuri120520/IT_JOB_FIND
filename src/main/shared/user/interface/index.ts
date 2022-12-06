import { PaginationInterface } from '@enouvo-packages/base-nestjs-api';
import { ObjectType, PickType } from '@nestjs/graphql';

import { User } from '@/db/entities/User';

@ObjectType({ isAbstract: true })
export class IUser extends PickType(User, [
  'id',
  'avatar',
  'email',
  'fullName',
  'gender',
  'isActive',
  'phoneNumber',
  'role',
  'roleId',
  'company',
  'userJobs',
  'createdAt',
  'updatedAt'
]) {}

@ObjectType({ isAbstract: true })
export class IUsers extends PaginationInterface<IUser>(IUser) {}
