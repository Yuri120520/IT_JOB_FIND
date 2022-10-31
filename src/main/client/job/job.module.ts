import { Module } from '@nestjs/common';

import { JobClientResolver } from './job.resolver';
import { JobClientService } from './job.service';

import { JobModule } from '@/main/shared/job/job.module';
import { JobResolver } from '@/main/shared/job/job.resolver';

@Module({
  providers: [JobClientResolver, JobClientService, JobResolver],
  imports: [JobModule]
})
export class JobClientModule {}
