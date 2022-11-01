import { Injectable, NotFoundException } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';
import { getManager } from 'typeorm';

import { UpdateCompanyProfileDto } from './dto';

import { Company } from '@/db/entities/Company';
import { CompanyAddress } from '@/db/entities/CompanyAddress';
import { CompanySkill } from '@/db/entities/CompanySkill';
import { messageKey } from '@/i18n';
import { CompanyService } from '@/main/shared/company/company.service';

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
        for (const address of addresses) {
          const { id, detail } = address;
          const addressRecord = id
            ? await transaction.getRepository(CompanyAddress).findOne(id)
            : transaction.getRepository(CompanyAddress).create({ companyId });

          await transaction.getRepository(CompanyAddress).save(CompanyAddress.merge(addressRecord, { detail }));
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
}
