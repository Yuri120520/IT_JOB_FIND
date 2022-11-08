import { PaginationInterface } from '@enouvo-packages/base-nestjs-api';
import { ObjectType } from '@nestjs/graphql';

import { UserJob } from '@/db/entities/UserJob';

@ObjectType({ isAbstract: true })
export class IUserJob extends UserJob {}

@ObjectType({ isAbstract: true })
export class IUserJobs extends PaginationInterface<IUserJob>(IUserJob) {}
