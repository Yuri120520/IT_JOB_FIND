import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsUUID } from 'class-validator';

import { JobStatus } from '@/db/entities/Job';

@InputType()
export class UpdateJobStatusDto {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => JobStatus)
  @IsEnum(JobStatus)
  status: JobStatus;
}
