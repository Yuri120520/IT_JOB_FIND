import { BaseResolver } from '@enouvo-packages/base-nestjs-api';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { ApplyJobDto, UpsertUserJobDto } from './dto';
import { IUserJob, IUserJobs } from './interface';
import { UserJobService } from './userJob.service';

import { ROLE } from '@/common/constant';
import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { UserJob } from '@/db/entities/UserJob';
import { Auth } from '@/decorators/auth.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { Context, GetContext } from '@/decorators/user.decorator';

@Resolver()
export class UserJobResolver extends BaseResolver<IUserJobs, IUserJob>({
  getAllBase: IUserJobs,
  getOneBase: IUserJob,
  classRef: UserJob.name
}) {
  constructor(protected service: UserJobService) {
    super(service);
  }

  @Roles(ROLE.USER)
  @Auth(['Roles'])
  @Mutation(() => IUserJob, { name: 'upsertUserJob' })
  async upsertUserJob(@Args('input') input: UpsertUserJobDto, @GetContext() ctx: Context) {
    const { currentUser } = ctx;
    return await this.service.upsertUserJob(currentUser.id, input);
  }

  @Roles(ROLE.USER)
  @Auth(['Roles'])
  @Mutation(() => ResponseMessageBase, { name: 'applyJob' })
  async applyJob(@Args('input') input: ApplyJobDto, @GetContext() ctx: Context) {
    const { currentUser } = ctx;
    return await this.service.applyJob(currentUser.id, input);
  }
}
