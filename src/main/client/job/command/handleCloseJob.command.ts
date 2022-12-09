/* eslint-disable no-param-reassign */
import { getManager } from 'typeorm';

import { Application } from '@/db/entities/Application';
import { Job, JobStatus } from '@/db/entities/Job';
import { UserJob } from '@/db/entities/UserJob';

export class HandleCloseJobCommand {
  static async execute(job: Job, transaction = getManager()) {
    const userJobs = await UserJob.find({ where: { jobId: job.id, isApplied: true }, relations: ['application'] });
    const notRepliedApplications = userJobs.length ? userJobs.filter(item => !item.application.replyData) : undefined;
    if (notRepliedApplications && notRepliedApplications.length) {
      const REJECTED_MESSAGE_DEFAULT = `
      Thank you for your application for the  ${job.description.title} at ${job.company.name}. We really appreciate your interest in joining our company and we want to thank you for the time and energy you invested in your application for the position.

      We received a large number of applications, and after carefully reviewing all of them, unfortunately, we have to inform you that this time we won’t be able to invite you to the next round of our hiring process.

      Due to the high number of applications we are, unfortunately, not able to provide individual feedback to your application at this early stage of the process. 

      However, we really appreciated your application and you are welcome to apply again at ${job.company.name} in the future.

      We wish you all the best in your job search.
      `;

      await transaction
        .getRepository(Application)
        .createQueryBuilder()
        .update()
        .set({ isAccepted: false, replyData: { message: REJECTED_MESSAGE_DEFAULT } })
        .where('userJobId IN (...:userJobIds)', { userJobIds: notRepliedApplications.map(item => item.id) })
        .execute();

      //sendEmail
    }

    job.status = JobStatus.CLOSED;

    await transaction.getRepository(Job).save(job);
  }
}
