import { BaseService, QueryFilterDto } from '@enouvo-packages/base-nestjs-api';
import { Injectable, NotFoundException } from '@nestjs/common';
import { getManager } from 'typeorm';

import { GenerateFilterResultWithPagination } from '../job/command/generateFilterResultWithPagination';
import { AttachCompanyFilterCommand } from './command/attachCompanyFilter';
import { CompanyFilterDto } from './dto';

import { Company } from '@/db/entities/Company';
import { messageKey } from '@/i18n';

@Injectable()
export class CompanyService extends BaseService<Company> {
  constructor() {
    super(Company);
  }

  static async getOneByUserId(
    userId: string,
    throwErrorIfNotExists = true,
    transaction = getManager(),
    relations?: string[]
  ) {
    const company = await transaction.getRepository(Company).findOne({ userId }, { relations });

    if (!company && throwErrorIfNotExists) {
      throw new NotFoundException(messageKey.BASE.DATA_NOT_FOUND);
    }
    return company;
  }

  async searchCompany(filters: CompanyFilterDto, queryParams: QueryFilterDto) {
    const builder = Company.createQueryBuilder('Company')
      .leftJoinAndSelect('Company.companyAddresses', 'CompanyAddress')
      .leftJoinAndSelect('Company.companySkills', 'CompanySkill')
      .leftJoinAndSelect('CompanySkill.skill', 'Skill')
      .leftJoinAndSelect('Company.user', 'User')
      .leftJoinAndSelect('Company.jobs', 'Job')
      .where(`User.isActive=TRUE`);

    AttachCompanyFilterCommand.addFilterQuery(builder, filters);
    return GenerateFilterResultWithPagination.execute(builder, queryParams);
  }
}
