import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { getManager } from 'typeorm';

import { ReplyApplicationDto, UpsertJobDto } from './dto';

import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { Application } from '@/db/entities/Application';
import { CompanyAddress } from '@/db/entities/CompanyAddress';
import { Job } from '@/db/entities/Job';
import { JobAddress } from '@/db/entities/JobAddress';
import { JobLevel } from '@/db/entities/JobLevel';
import { JobSkill } from '@/db/entities/JobSkill';
import { UserJob } from '@/db/entities/UserJob';
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
        ? await JobService.getOneById(input.id, transaction, false, ['company', 'company.user'])
        : await transaction.getRepository(Job).save(Job.create({ companyId: company.id }));

      if (job) {
        const userJob = await UserJob.findOne({ jobId: input.id, isApplied: true });

        if (
          userJob &&
          input.salary &&
          (input.salary.isNegotiable !== job.salary.isNegotiable ||
            input.salary.max !== job.salary.max ||
            job.salary.min !== input.salary.min)
        ) {
          throw new BadRequestException(messageKey.BASE.NOT_UPDATE_JOB);
        }
      }

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
        await transaction
          .getRepository(CompanyAddress)
          .createQueryBuilder('CompanyAddress')
          .update()
          .set({ isUsed: true })
          .where(`id in (:...ids)`, { ids: addressIds })
          .execute();
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
    const userJob = await UserJob.findOne({ jobId });

    if (userJob) {
      throw new BadRequestException(messageKey.BASE.NOT_DELETE_JOB);
    }

    await Job.createQueryBuilder().delete().where('id = :jobId', { jobId }).execute();
    return { message: messageKey.BASE.SUCCESSFULLY, success: true };
  }

  async replyApplication(userId: string, input: ReplyApplicationDto) {
    const { id, isAccept, interview, message } = input;
    const application = await Application.findOne(
      { id },
      { relations: ['userJob', 'userJob.job', 'userJob.job.company', 'userJob.job.company.user'] }
    );

    if (application.userJob.job.company.user.id !== userId) {
      throw new BadRequestException(messageKey.BASE.YOU_ARE_NOT_THIS_JOB_OWNER);
    }

    if (application.replyData) {
      throw new BadRequestException(messageKey.BASE.APPLICATION_IS_REPLIED);
    }

    application.isAccepted = isAccept;
    application.replyData = { message, interview };

    await Application.save(application);

    return { message: messageKey.BASE.SUCCESSFULLY, success: true };
  }
}
