import { BaseService, QueryFilterDto } from '@enouvo-packages/base-nestjs-api';
import { Injectable, NotFoundException } from '@nestjs/common';
import { getManager } from 'typeorm';

import { AttachJobFilterCommand } from './command/attachJobFilter';
import { GenerateFilterResultWithPagination } from './command/generateFilterResultWithPagination';
import { JobFilterDto } from './dto';

import { Job, JobStatus } from '@/db/entities/Job';
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

  async searchJobs(filters: JobFilterDto, queryParams: QueryFilterDto) {
    const builder = Job.createQueryBuilder('Job')
      .leftJoinAndSelect('Job.company', 'Company')
      .leftJoinAndSelect('Job.skills', 'JobSkill')
      .leftJoinAndSelect('JobSkill.skill', 'Skill')
      .leftJoinAndSelect('Job.levels', 'JobLevel')
      .leftJoinAndSelect('JobLevel.level', 'Level')
      .leftJoinAndSelect('Job.addresses', 'JobAddress')
      .leftJoinAndSelect('JobAddress.address', 'CompanyAddress')
      .where(`Job.status = :status AND Job.closeDate >= now()`, { status: JobStatus.OPEN });

    AttachJobFilterCommand.addFilterQuery(builder, filters);
    return GenerateFilterResultWithPagination.execute(builder, queryParams);
  }
}
