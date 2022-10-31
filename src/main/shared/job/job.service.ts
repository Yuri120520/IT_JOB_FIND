import { BaseService } from '@enouvo-packages/base-nestjs-api';
import { Injectable, NotFoundException } from '@nestjs/common';
import { getManager } from 'typeorm';

import { Job } from '@/db/entities/Job';
import { messageKey } from '@/i18n';

@Injectable()
export class JobService extends BaseService<Job> {
  constructor() {
    super(Job);
  }
  static async getOneById(id: string, transaction = getManager(), throwIfNotExists = true, relations?: string[]) {
    const job = await transaction.getRepository(Job).findOne({ id }, { relations });

    if (!job && throwIfNotExists) {
      throw new NotFoundException(messageKey.BASE.DATA_NOT_FOUND);
    }
    return job;
  }
}
