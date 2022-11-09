import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UpdateJobStatusDto } from './dto';
import { JobAdminService } from './job.service';

import { ROLE } from '@/common/constant';
import { Auth } from '@/decorators/auth.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { IJob } from '@/main/shared/job/interface';

@Roles(ROLE.ADMIN)
@Auth(['Roles'])
@Resolver()
export class JobAdminResolver {
  constructor(private service: JobAdminService) {}
  @Mutation(() => IJob, { name: 'updateJobStatus' })
  async updateJobStatus(@Args('input') input: UpdateJobStatusDto) {
    return await this.service.updateJobStatus(input);
  }
}
