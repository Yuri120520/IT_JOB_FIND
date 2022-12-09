import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';

import { ReplyApplicationDto, UpsertJobDto } from './dto';
import { JobClientService } from './job.service';

import { ROLE } from '@/common/constant';
import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { Job } from '@/db/entities/Job';
import { Auth } from '@/decorators/auth.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { Context, GetContext } from '@/decorators/user.decorator';

@Roles(ROLE.EMPLOYER)
@Auth(['role'])
@Resolver()
export class JobClientResolver {
  constructor(private service: JobClientService) {}

  @Mutation(() => Job, { name: 'upsertJob' })
  async upsertJob(@GetContext() ctx: Context, @Args('input') input: UpsertJobDto) {
    const { currentUser } = ctx;
    return await JobClientService.upsertJob(currentUser.id, input);
  }

  @Mutation(() => ResponseMessageBase, { name: 'deleteJob' })
  async deleteJob(@GetContext() ctx: Context, @Args('id', { type: () => ID }) id: string) {
    const { currentUser } = ctx;
    return await this.service.deleteOne(currentUser.id, id);
  }

  @Mutation(() => ResponseMessageBase, { name: 'replyApplication' })
  async replyApplication(@Args('input') input: ReplyApplicationDto, @GetContext() ctx: Context) {
    const { currentUser } = ctx;
    return await this.service.replyApplication(currentUser.id, input);
  }
}
