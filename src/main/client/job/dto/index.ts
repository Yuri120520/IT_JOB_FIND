import { Field, ID, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsBoolean,
  IsDate,
  IsEnum,
  IsIn,
  IsOptional,
  IsPositive,
  IsUUID,
  Max,
  Validate,
  ValidateNested
} from 'class-validator';

import { MAX_SALARY } from '@/common/constant';
import { InterviewMethod } from '@/db/entities/Application';
import { JobStatus, JobType } from '@/db/entities/Job';
import { EntityExistingValidator } from '@/decorators/entityExistingValidator.decorator';

@InputType()
export class JobDescriptionDto {
  @Field({ nullable: true })
  title: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @ArrayMinSize(1)
  responsibilities: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @ArrayMinSize(1)
  requirements: string[];
}

@InputType()
export class SalaryDto {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isNegotiable: boolean;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsPositive()
  @Max(MAX_SALARY)
  max: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsPositive()
  min: number;
}
@InputType()
export class UpsertJobDto {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  @Validate(EntityExistingValidator, ['job'])
  id: string;

  @Field(() => JobDescriptionDto, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => JobDescriptionDto)
  description: JobDescriptionDto;

  @Field(() => SalaryDto, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => SalaryDto)
  salary: SalaryDto;

  @Field(() => [Number], { nullable: true })
  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique()
  yearOfExperiences: number[];

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  closeDate: Date;

  @Field(() => JobStatus, { nullable: true })
  @IsOptional()
  @IsEnum(JobStatus)
  @IsIn([JobStatus.OPEN, JobStatus.CLOSED], { message: 'Not allowed to choose blocked status for role.' })
  status: JobStatus;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @ArrayNotEmpty()
  recruitmentProcess: string[];

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @Validate(EntityExistingValidator, ['level'], { each: true })
  levelIds: string[];

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @Validate(EntityExistingValidator, ['skill'], { each: true })
  skillIds: string[];

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @Validate(EntityExistingValidator, ['company_address'], { each: true })
  addressIds: string[];

  @Field(() => [JobType], { nullable: true })
  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(JobType, { each: true })
  types: JobType[];
}

@InputType()
export class InterviewEventDto {
  @Field(() => InterviewMethod)
  @IsEnum(InterviewMethod)
  method: InterviewMethod;

  @Field({ nullable: true })
  address: string;
}
@InputType()
export class InterviewResponseDto {
  @Field(() => Date)
  @IsDate()
  startTime: Date;

  @Field(() => Date)
  @IsDate()
  endTime: Date;

  @Field(() => [InterviewEventDto])
  @ValidateNested({ each: true })
  @Type(() => InterviewEventDto)
  events: InterviewEventDto[];
}

@InputType()
export class ReplyApplicationDto {
  @Field(() => ID)
  @Validate(EntityExistingValidator, ['application'])
  id: string;

  @Field(() => Boolean)
  @IsBoolean()
  isAccept: boolean;

  @Field()
  message: string;

  @Field(() => InterviewResponseDto, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => InterviewResponseDto)
  interview: InterviewResponseDto;
}
