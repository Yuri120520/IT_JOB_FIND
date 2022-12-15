import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CVClientService } from './cv.service';
import { UpsertCVDto } from './dto';

import { ROLE } from '@/common/constant';
import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { Auth } from '@/decorators/auth.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { Context, GetContext } from '@/decorators/user.decorator';

@Roles(ROLE.USER)
@Auth(['Roles'])
@Resolver()
export class CVClientResolver {
  constructor(private service: CVClientService) {}

  @Mutation(() => ResponseMessageBase, { name: 'upsertCV' })
  async upsertCV(@Args('input') input: UpsertCVDto, @GetContext() ctx: Context) {
    const { currentUser } = ctx;
    return await this.service.upsertCV(currentUser.id, input);
  }

  @Mutation(() => ResponseMessageBase, { name: 'deleteCV' })
  async deleteCV(@Args('id') id: string, @GetContext() ctx: Context) {
    const { currentUser } = ctx;
    return await this.service.deleteOne(currentUser.id, id);
  }
}
