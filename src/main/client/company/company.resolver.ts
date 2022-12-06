import { QueryFilterDto } from '@enouvo-packages/base-nestjs-api';
import { Args, ID, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { IUsers } from './../../shared/user/interface/index';
import { CompanyClientService } from './company.service';
import { UpdateCompanyProfileDto } from './dto';

import { ROLE } from '@/common/constant';
import { Auth } from '@/decorators/auth.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { Context, GetContext } from '@/decorators/user.decorator';
import { ICompany } from '@/main/shared/company/interface';

@Roles(ROLE.EMPLOYER)
@Auth(['Roles'])
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

  @Query(() => ICompany, { name: 'getMyCompany' })
  async getMyCompany(@GetContext() ctx: Context, @Info() info: GraphQLResolveInfo) {
    const { currentUser } = ctx;
    return await this.service.findOne({ userId: currentUser.id }, info);
  }

  @Query(() => IUsers, { name: 'getCandidateOfCompany' })
  async getCandidateOfCompany(
    @Args('companyId', { type: () => ID }) companyId: string,
    @Args('queryParams') queryParams: QueryFilterDto
  ) {
    return await this.service.getCandidatesOfCompany(companyId, queryParams);
  }
}
