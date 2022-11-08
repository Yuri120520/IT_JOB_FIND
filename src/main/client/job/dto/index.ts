import { Field, ID, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsDate,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  Validate,
  ValidateNested
} from 'class-validator';

import { SalaryUnit } from '@/common/constant';
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
  @IsNumber()
  @Min(0)
  max: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  min: number;

  @Field(() => SalaryUnit, { nullable: true })
  @IsOptional()
  @IsEnum(SalaryUnit)
  unit: SalaryUnit;

  @Field({ nullable: true })
  currency: string;
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
  @IsIn([JobStatus.OPEN, JobStatus.CLOSE], { message: 'Not allowed to choose blocked status for role.' })
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
