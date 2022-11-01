import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CompanyClientService } from './company.service';
import { UpdateCompanyProfileDto } from './dto';

import { ROLE } from '@/common/constant';
import { Auth } from '@/decorators/auth.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { Context, GetContext } from '@/decorators/user.decorator';
import { ICompany } from '@/main/shared/company/interface';

@Roles(ROLE.EMPLOYER)
@Auth(['Role'])
@Resolver()
export class CompanyClientResolver {
  constructor(private service: CompanyClientService) {}

  @Mutation(() => ICompany, { name: 'updateCompanyProfile' })
  async updateCompany(
    @GetContext() ctx: Context,
    @Args('input') input: UpdateCompanyProfileDto,
    @Info() info: GraphQLResolveInfo
  ) {
    const { currentUser } = ctx;
    return await this.service.updateCompanyProfile(currentUser.id, input, info);
  }
}
