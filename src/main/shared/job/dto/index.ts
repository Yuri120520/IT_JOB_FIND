import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsEnum, IsOptional, IsPositive, Validate, ValidateNested } from 'class-validator';

import { JobType } from '@/db/entities/Job';
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
}
