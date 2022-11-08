import { BaseResolver } from '@enouvo-packages/base-nestjs-api';
import { Resolver } from '@nestjs/graphql';

import { IUserJob, IUserJobs } from './interface';
import { UserJobService } from './userJob.service';

import { UserJob } from '@/db/entities/UserJob';

@Resolver()
export class UserJobResolver extends BaseResolver<IUserJobs, IUserJob>({
  getAllBase: IUserJobs,
  getOneBase: IUserJob,
  classRef: UserJob.name
}) {
  constructor(protected service: UserJobService) {
    super(service);
  }
}
