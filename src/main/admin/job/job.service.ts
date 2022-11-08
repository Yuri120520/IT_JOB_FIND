import { BadGatewayException, Injectable } from '@nestjs/common';

import { UpdateJobStatusDto } from './dto';

import { Job, JobStatus } from '@/db/entities/Job';
import { messageKey } from '@/i18n';
import { JobService } from '@/main/shared/job/job.service';

@Injectable()
export class JobAdminService extends JobService {
  async updateJobStatus(input: UpdateJobStatusDto) {
    const { id, status } = input;
    const job = await JobService.getOneById(id);

    if (job.status === status || (job.status === JobStatus.CLOSE && status === JobStatus.OPEN)) {
      throw new BadGatewayException(messageKey.BASE.UPDATE_JOB_STATUS_NOT_CORRECT);
    }
    job.status = status;
    return await Job.save(job);
  }
}
