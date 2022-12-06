import { QueryFilterDto } from '@enouvo-packages/base-nestjs-api';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';
import { getManager } from 'typeorm';

import { UpdateCompanyProfileDto } from './dto';

import { Company } from '@/db/entities/Company';
import { CompanyAddress } from '@/db/entities/CompanyAddress';
import { CompanySkill } from '@/db/entities/CompanySkill';
import { User } from '@/db/entities/User';
import { messageKey } from '@/i18n';
import { CompanyService } from '@/main/shared/company/company.service';
import { GenerateFilterResultWithPagination } from '@/main/shared/job/command/generateFilterResultWithPagination';

@Injectable()
export class CompanyClientService extends CompanyService {
  async updateCompanyProfile(userId: string, input: UpdateCompanyProfileDto, info: GraphQLResolveInfo) {
    return await getManager().transaction(async transaction => {
      const { addresses, skillIds, ...data } = input;
      const company = await this.findOne({ userId }, info);

      if (!company) {
        throw new NotFoundException(messageKey.BASE.DATA_NOT_FOUND);
      }

      const companyId = company.id;

      if (addresses) {
        const updateAddressIds = addresses.filter(item => !!item.id).map(item => item.id);
        if (updateAddressIds.length) {
          await transaction
            .getRepository(CompanyAddress)
            .createQueryBuilder()
            .delete()
            .where('id not in (:...ids) and companyId = :companyId', {
              ids: updateAddressIds,
              companyId
            })
            .execute();
        }

        for (const address of addresses) {
          const { id, detail } = address;
          const addressRecord = id
            ? await transaction.getRepository(CompanyAddress).findOne(id)
            : transaction.getRepository(CompanyAddress).create();

          await transaction
            .getRepository(CompanyAddress)
            .save(CompanyAddress.merge(addressRecord, { detail, companyId }));
        }
      }

      if (skillIds) {
        await transaction
          .getRepository(CompanySkill)
          .createQueryBuilder()
          .delete()
          .where(`companyId  = :companyId`, { companyId })
          .execute();
        for (const skillId of skillIds) {
          await transaction.getRepository(CompanySkill).save({ companyId, skillId });
        }
      }

      const mergingCompany = Company.merge(company, { ...data });
      return await Company.save(mergingCompany);
    });
  }

  async getCandidatesOfCompany(companyId: string, queryParams: QueryFilterDto) {
    const company = await Company.findOne({ id: companyId });

    if (!company) {
      throw new NotFoundException(messageKey.BASE.DATA_NOT_FOUND);
    }

    const builder = User.createQueryBuilder('User')
      .leftJoinAndSelect('User.userJobs', 'UserJob')
      .leftJoinAndSelect('UserJob.job', 'Job')
      .leftJoinAndSelect('UserJob.application', 'Application')
      .leftJoinAndSelect('Application.CV', 'CV')
      .where('UserJob.isApplied = true AND Job.companyId = :companyId', { companyId });

    return await GenerateFilterResultWithPagination.execute(builder, queryParams);
  }
}
