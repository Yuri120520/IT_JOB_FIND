import { BaseResolver, QueryFilterDto } from '@enouvo-packages/base-nestjs-api';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { CompanyService } from './company.service';
import { CompanyFilterDto } from './dto';
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
  async findAll(@Args('filters') filters: CompanyFilterDto, @Args('queryParams') queryParams: QueryFilterDto) {
    return await this.service.searchCompany(filters, queryParams);
  }
}
