import { Module } from '@nestjs/common';

import { JobAdminResolver } from './job.resolver';
import { JobAdminService } from './job.service';

import { JobModule } from '@/main/shared/job/job.module';
import { JobResolver } from '@/main/shared/job/job.resolver';

@Module({
  providers: [JobAdminResolver, JobAdminService, JobResolver],
  imports: [JobModule]
})
export class JobAdminModule {}
