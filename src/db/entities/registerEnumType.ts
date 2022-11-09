import { registerEnumType } from '@nestjs/graphql';

import { InterviewMethod } from './Application';
import { JobStatus, JobType } from './Job';

import { Gender, SalaryUnit } from '@/common/constant';

registerEnumType(Gender, { name: 'Gender' });

registerEnumType(SalaryUnit, { name: 'SalaryUnit' });

registerEnumType(JobStatus, { name: 'JobStatus' });

registerEnumType(JobType, { name: 'JobType' });

registerEnumType(InterviewMethod, { name: 'InterviewMethod' });
