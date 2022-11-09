import { BaseService } from '@enouvo-packages/base-nestjs-api';
import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { getManager } from 'typeorm';

import { ApplyJobDto, UpsertUserJobDto } from './dto';

import { Application } from '@/db/entities/Application';
import { UserJob } from '@/db/entities/UserJob';
import { messageKey } from '@/i18n';

@Injectable()
export class UserJobService extends BaseService<UserJob> {
  constructor() {
    super(UserJob);
  }
  async upsertUserJob(userId: string, input: UpsertUserJobDto) {
    const { id, ...data } = input;

    const existingUserJob = await UserJobService.getOneById(id, userId, false);

    const mergingUserJob = UserJob.merge(existingUserJob ?? UserJob.create({ userId }), { ...data });

    return await UserJob.save(mergingUserJob);
  }

  async applyJob(userId: string, input: ApplyJobDto) {
    return await getManager().transaction(async transaction => {
      const { jobId, ...data } = input;

      let userJob = await transaction.getRepository(UserJob).findOne({ jobId, userId });

      if (userJob && userJob.isApplied === true) {
        throw new BadGatewayException(messageKey.BASE.JOB_IS_APPLIED);
      }

      if (!userJob) {
        userJob = await transaction.getRepository(UserJob).save({ userId, jobId });
      }

      await transaction.getRepository(Application).save({ userJobId: userJob.id, ...data });

      await transaction
        .getRepository(UserJob)
        .createQueryBuilder()
        .update()
        .set({ isApplied: true })
        .where({ id: userJob.id })
        .execute();

      return { message: messageKey.BASE.SUCCESSFULLY, success: true };
    });
  }

  static async getOneById(id: string, userId: string, throwErrorIfNotExist = true, transaction = getManager()) {
    const userJob = await transaction.getRepository(UserJob).findOne({ id, userId });

    if (!userJob && throwErrorIfNotExist) {
      throw new NotFoundException(messageKey.BASE.DATA_NOT_FOUND);
    }
    return userJob;
  }
}
