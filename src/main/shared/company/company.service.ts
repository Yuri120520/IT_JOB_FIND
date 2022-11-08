import { BaseService } from '@enouvo-packages/base-nestjs-api';
import { Injectable, NotFoundException } from '@nestjs/common';
import { getManager } from 'typeorm';

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
}
