import { registerEnumType } from '@nestjs/graphql';

import { InterviewMethod } from './Application';
import { JobStatus, JobType } from './Job';

import { Gender } from '@/common/constant';

registerEnumType(Gender, { name: 'Gender' });

registerEnumType(JobStatus, { name: 'JobStatus' });

registerEnumType(JobType, { name: 'JobType' });

registerEnumType(InterviewMethod, { name: 'InterviewMethod' });
