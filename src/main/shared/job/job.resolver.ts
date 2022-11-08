import { BaseResolver } from '@enouvo-packages/base-nestjs-api';
import { Resolver } from '@nestjs/graphql';

import { IJob, IJobs } from './interface';
import { JobService } from './job.service';

import { Job } from '@/db/entities/Job';

@Resolver()
export class JobResolver extends BaseResolver<IJobs, IJob>({
  getAllBase: IJobs,
  getOneBase: IJob,
  classRef: Job.name
}) {
  constructor(protected service: JobService) {
    super(service);
  }
}
