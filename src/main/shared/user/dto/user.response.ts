import { User } from '@/db/entities/User';
import { PaginationInterface } from '@enouvo-packages/base-nestjs-api';
import { ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: false })
export class IUser extends User {}

@ObjectType({ isAbstract: true })
export class IUsers extends PaginationInterface<IUser>(IUser) {}
