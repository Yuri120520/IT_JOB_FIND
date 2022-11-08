import { Injectable, NotFoundException } from '@nestjs/common';
import { getManager } from 'typeorm';

import { UpsertJobDto } from './dto';

import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { Job } from '@/db/entities/Job';
import { JobAddress } from '@/db/entities/JobAddress';
import { JobLevel } from '@/db/entities/JobLevel';
import { JobSkill } from '@/db/entities/JobSkill';
import { messageKey } from '@/i18n';
import { CompanyService } from '@/main/shared/company/company.service';
import { JobService } from '@/main/shared/job/job.service';
import { GetUserQuery } from '@/main/shared/user/query/getUser.query';

@Injectable()
export class JobClientService extends JobService {
  async upsertJob(userId: string, input: UpsertJobDto) {
    return await getManager().transaction(async transaction => {
      const { addressIds, levelIds, skillIds, ...data } = input;
      const company = await CompanyService.getOneByUserId(userId, true, transaction);

      const job = input.id
        ? await JobService.getOneById(input.id, transaction, false)
        : await transaction.getRepository(Job).save(Job.create({ companyId: company.id }));

      if (addressIds) {
        if (input.id) {
          transaction
            .getRepository(JobAddress)
            .createQueryBuilder()
            .delete()
            .where(`jobId = :jobId`, { jobId: job.id })
            .execute();
        }
        for (const addressId of addressIds) {
          await transaction.getRepository(JobAddress).save({ addressId, jobId: job.id });
        }
      }
      if (levelIds) {
        if (input.id) {
          transaction
            .getRepository(JobLevel)
            .createQueryBuilder()
            .delete()
            .where(`jobId = :jobId`, { jobId: job.id })
            .execute();
        }
        for (const levelId of levelIds) {
          await transaction.getRepository(JobLevel).save({ levelId, jobId: job.id });
        }
      }
      if (skillIds) {
        if (input.id) {
          transaction
            .getRepository(JobSkill)
            .createQueryBuilder()
            .delete()
            .where(`jobId = :jobId`, { jobId: job.id })
            .execute();
        }
        for (const skillId of skillIds) {
          await transaction.getRepository(JobSkill).save({ skillId, jobId: job.id });
        }
      }
      const mergingJob = transaction.getRepository(Job).merge(job, { ...data });

      return await transaction.getRepository(Job).save(mergingJob);
    });
  }

  async deleteOne(userId: string, jobId: string): Promise<ResponseMessageBase> {
    const user = await GetUserQuery.getUserById(userId, true, getManager(), ['company']);

    const job = await JobService.getOneById(jobId);
    if (!job || job.companyId !== user.company.id) {
      throw new NotFoundException(messageKey.BASE.DATA_NOT_FOUND);
    }

    // implement get application for job.  if have application, cant deletes

    await Job.createQueryBuilder().delete().where('id = :jobId', { jobId });
    return { message: messageKey.BASE.SUCCESSFULLY, success: true };
  }
}
