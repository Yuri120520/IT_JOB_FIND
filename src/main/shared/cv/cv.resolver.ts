import { BaseResolver } from '@enouvo-packages/base-nestjs-api';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CVService } from './cv.service';
import { ICV, ICVs } from './interface';

import { ROLE } from '@/common/constant';
import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { CV } from '@/db/entities/CV';
import { Auth } from '@/decorators/auth.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { Context, GetContext } from '@/decorators/user.decorator';
import { UpsertCVDto } from '@/main/client/cv/dto';

@Roles(ROLE.USER)
@Auth(['roles'])
@Resolver()
export class CVResolver extends BaseResolver<ICVs, ICV>({
  getAllBase: ICVs,
  getOneBase: ICV,
  classRef: CV.name
}) {
  constructor(private service: CVService) {
    super(service);
  }

  @Mutation(() => ICV, { name: 'upsertCV' })
  async upsertCV(@Args('input') input: UpsertCVDto, @GetContext() ctx: Context) {
    const { currentUser } = ctx;
    return await this.service.upsertCV(currentUser.id, input);
  }

  @Mutation(() => ResponseMessageBase, { name: 'deleteCV' })
  async deleteOne(@Args('id') id: string, @GetContext() ctx: Context) {
    const { currentUser } = ctx;
    return await this.service.deleteOne(currentUser.id, id);
  }
}
