import { Field, ID, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsEnum,
  IsOptional,
  IsPositive,
  Validate,
  ValidateNested
} from 'class-validator';

import { JobStatus, JobType } from '@/db/entities/Job';
import { EntityExistingValidator } from '@/decorators/entityExistingValidator.decorator';

@InputType()
export class SalaryRange {
  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsPositive()
  max: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsPositive()
  min: number;
}
@InputType()
export class JobFilterDto {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @Validate(EntityExistingValidator, ['skill'], { each: true })
  skillIds: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @ArrayMinSize(1)
  @Validate(EntityExistingValidator, ['level'], { each: true })
  levelIds: string[];

  @Field({ nullable: true })
  title: string;

  @Field(() => [JobType], { nullable: true })
  @IsOptional()
  @ArrayMinSize(1)
  @IsEnum(JobType, { each: true })
  types: JobType[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @ArrayMinSize(1)
  addresses: string[];

  @Field(() => [SalaryRange], { nullable: true })
  @IsOptional()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SalaryRange)
  salaryRanges: SalaryRange[];

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @Validate(EntityExistingValidator, ['company'])
  companyId: string;

  @Field(() => [JobStatus], { nullable: true })
  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(JobStatus, { each: true })
  statuses: JobStatus[];
}
