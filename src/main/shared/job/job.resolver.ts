import { BaseResolver, QueryFilterDto } from '@enouvo-packages/base-nestjs-api';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { JobFilterDto } from './dto';
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

  @Query(() => IJobs, { name: 'searchJob' })
  async searchJob(@Args('filters') filters: JobFilterDto, @Args('queryParams') queryParams: QueryFilterDto) {
    return await this.service.searchJobs(filters, queryParams);
  }
}
