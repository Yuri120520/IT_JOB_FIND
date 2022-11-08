import { registerEnumType } from '@nestjs/graphql';

import { JobStatus, JobType } from './Job';
import { UserJobStatus } from './UserJob';

import { Gender, SalaryUnit } from '@/common/constant';

registerEnumType(Gender, { name: 'Gender' });

registerEnumType(SalaryUnit, { name: 'SalaryUnit' });

registerEnumType(JobStatus, { name: 'JobStatus' });

registerEnumType(JobType, { name: 'JobType' });

registerEnumType(UserJobStatus, { name: 'UserJobStatus' });
