import dayjs from 'dayjs';
import { getManager } from 'typeorm';

import { Job, JobStatus } from '@/db/entities/Job';
import { HandleCloseJobCommand } from '@/main/client/job/command/handleCloseJob.command';

export class UpdateJobStatusAfterCloseDateCommand {
  static async execute(jobs: Job[]) {
    const transaction = getManager();
    for (const job of jobs) {
      if (dayjs(job.closeDate) < dayjs() && job.status === JobStatus.OPEN) {
        await HandleCloseJobCommand.execute(job, transaction);
      }
    }
    return jobs;
  }
}
