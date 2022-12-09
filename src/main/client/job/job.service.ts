import { GenerateJobResultCommand, JobResultDataGenerator } from './command/generateJobResult.command';

/* eslint-disable no-nested-ternary */
/* eslint-disable import/order */
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

/* eslint-disable no-param-reassign */
import { getManager } from 'typeorm';

import { ReplyApplicationDto, UpsertJobDto } from './dto';

import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { Application } from '@/db/entities/Application';
import { CompanyAddress } from '@/db/entities/CompanyAddress';
import { Job, JobStatus, PostInterval } from '@/db/entities/Job';
import { JobAddress } from '@/db/entities/JobAddress';
import { JobLevel } from '@/db/entities/JobLevel';
import { JobSkill } from '@/db/entities/JobSkill';
import { UserJob } from '@/db/entities/UserJob';
import { messageKey } from '@/i18n';
import { CompanyService } from '@/main/shared/company/company.service';

import { GetUserQuery } from '@/main/shared/user/query/getUser.query';
import dayjs from 'dayjs';
import { JobService } from '@/main/shared/job/job.service';
import { HandleCloseJobCommand } from './command/handleCloseJob.command';
import { emailService } from '@/services/smtp/services';
import { S3_UPLOAD_TYPE } from '@/common/constant';
import { GenerateJobResultResponse } from './interface';

@Injectable()
export class JobClientService extends JobService {
  static async upsertJob(userId: string, input: UpsertJobDto, transaction = getManager()) {
    const { addressIds, levelIds, skillIds, postInterval, ...data } = input;
    let closeDate;
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

    if (postInterval) {
      const interval = postInterval === PostInterval.MONTH ? 1 : postInterval === PostInterval.TWO_MONTHS ? 2 : 3;
      closeDate = dayjs().add(interval, 'months').format('DD/MM/YYYY');
    }
    const mergingJob = transaction.getRepository(Job).merge(job, { ...data, closeDate, postInterval });

    return await transaction.getRepository(Job).save(mergingJob);
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
      { relations: ['userJob', 'userJob.user', 'userJob.job', 'userJob.job.company', 'userJob.job.company.user'] }
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

    if (isAccept) {
      await emailService.sendEmailAcceptedApplication(application.userJob.user, application.userJob.job);
    } else {
      await emailService.sendEmailRejectedApplication(application.userJob.user, application.userJob.job);
    }

    return { message: messageKey.BASE.SUCCESSFULLY, success: true };
  }

  async markJobAsCompleted(jobId: string, userId: string) {
    return await getManager().transaction(async transaction => {
      const job = await JobService.getOneById(jobId, transaction, true, ['company']);

      if (job.company.userId !== userId) {
        throw new ForbiddenException(messageKey.BASE.NOT_PERMISSION);
      }

      if (job.status !== JobStatus.OPEN) {
        throw new BadRequestException(messageKey.BASE.JOB_CAN_NOT_MARK_AS_COMPLETED);
      }
      await HandleCloseJobCommand.execute(job, transaction);
      return { message: messageKey.BASE.SUCCESSFULLY, success: true };
    });
  }

  async generateJobResult(userId: string, jobId: string): Promise<GenerateJobResultResponse> {
    const job = await Job.findOne(
      { id: jobId, status: JobStatus.CLOSED },
      { relations: ['company', 'userJobs', 'userJobs.application', 'userJobs.user', 'userJobs.application.CV'] }
    );

    if (job.company.userId !== userId) {
      throw new ForbiddenException(messageKey.BASE.NOT_PERMISSION);
    }

    if (job.userJobs && job.userJobs.length) {
      const data: JobResultDataGenerator[] = job.userJobs.map(
        item =>
          ({
            email: item.user.email,
            accepted: item.application.isAccepted,
            cv: item.application.CV.url,
            fullName: item.user.fullName,
            phoneNumber: item.user.phoneNumber
          } as JobResultDataGenerator)
      );
      const sheetName = `Result of ${job.description.title}`;
      const excelData = await GenerateJobResultCommand.excelGenerator(data, sheetName);
      const resultUrl = await GenerateJobResultCommand.exportResult(
        excelData,
        `${S3_UPLOAD_TYPE.Public}/job-result/${job.companyId}`
      );

      await Job.createQueryBuilder().update().set({ resultUrl }).where({ id: job.id }).execute();
      return { resultUrl };
    }
    return { resultUrl: null };
  }
}
