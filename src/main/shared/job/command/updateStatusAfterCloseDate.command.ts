import dayjs from 'dayjs';
import { getManager } from 'typeorm';

import { Job, JobStatus } from '@/db/entities/Job';

export class UpdateJobStatusAfterCloseDateCommand {
  static async execute(jobs: Job[]) {
    const transaction = getManager();
    for (const job of jobs) {
      if (dayjs(job.closeDate) < dayjs() && job.status === JobStatus.OPEN) {
        await transaction
          .getRepository(Job)
          .createQueryBuilder()
          .update()
          .set({ status: JobStatus.CLOSED })
          .where({ id: job.id })
          .execute();
        job.status = JobStatus.CLOSED;
      }
    }
    return jobs;
  }
}
