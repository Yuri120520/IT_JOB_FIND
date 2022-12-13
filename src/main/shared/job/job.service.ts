import { BaseService, QueryFilterDto } from '@enouvo-packages/base-nestjs-api';
import { Injectable, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import { GraphQLResolveInfo } from 'graphql';
import { getManager } from 'typeorm';

import { AttachJobFilterCommand } from './command/attachJobFilter';
import { GenerateFilterResultWithPagination } from './command/generateFilterResultWithPagination';
import { UpdateJobStatusAfterCloseDateCommand } from './command/updateStatusAfterCloseDate.command';
import { JobFilterDto } from './dto';

import { Job, JobStatus } from '@/db/entities/Job';
import { messageKey } from '@/i18n';
import { HandleCloseJobCommand } from '@/main/client/job/command/handleCloseJob.command';

@Injectable()
export class JobService extends BaseService<Job> {
  constructor() {
    super(Job);
  }
  async getOne(id: string, info: GraphQLResolveInfo) {
    const job: Job = await JobService.getOneById(id);

    if (dayjs(job.closeDate) < dayjs() && job.status === JobStatus.OPEN) {
      await HandleCloseJobCommand.execute(job);
    }

    return await this.findOne({ id }, info);
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
      .leftJoinAndSelect('Job.userJobs', 'userJob')
      .where('Job.status NOT IN  (:...status)', { status: [JobStatus.DELETED] });

    AttachJobFilterCommand.addFilterQuery(builder, filters);

    const result = await GenerateFilterResultWithPagination.execute(builder, queryParams);
    if (result.items.length) {
      result.items = await UpdateJobStatusAfterCloseDateCommand.execute(result.items);
    }
    return result;
  }
}
