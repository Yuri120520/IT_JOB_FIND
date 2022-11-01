import { BaseQueryFilter, BaseResolver, QUERY_OPERATOR, QueryFilterDto } from '@enouvo-packages/base-nestjs-api';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CompanyService } from './company.service';
import { ICompanies, ICompany } from './interface/index';

import { Company } from '@/db/entities/Company';

@Resolver()
export class CompanyResolver extends BaseResolver<ICompanies, ICompany>({
  getAllBase: ICompanies,
  getOneBase: ICompany,
  classRef: Company.name
}) {
  constructor(protected service: CompanyService) {
    super(service);
  }

  @Query(() => ICompanies, { name: 'getCompanies' })
  async findAll(@Args('queryParams') queryParams: QueryFilterDto, @Info() info: GraphQLResolveInfo) {
    return await this.service.findAll(
      BaseQueryFilter.attachFilters(queryParams, [
        {
          field: 'User.isActive',
          data: 'true',
          operator: QUERY_OPERATOR.like
        }
      ]),
      info
    );
  }
}
