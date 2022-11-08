import { PaginationInterface } from '@enouvo-packages/base-nestjs-api';
import { ObjectType } from '@nestjs/graphql';

import { Job } from '@/db/entities/Job';

@ObjectType({ isAbstract: true })
export class IJob extends Job {}

@ObjectType({ isAbstract: true })
export class IJobs extends PaginationInterface<IJob>(IJob) {}
