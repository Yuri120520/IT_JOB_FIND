import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, Validate } from 'class-validator';

import { EntityExistingValidator } from '@/decorators/entityExistingValidator.decorator';

@InputType()
export class UpsertUserJobDto {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @Validate(EntityExistingValidator, ['user_job'])
  id: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @Validate(EntityExistingValidator, ['job'])
  jobId: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isFollowing: boolean;
}

@InputType()
export class ApplyJobDto {
  @Field(() => ID)
  @Validate(EntityExistingValidator, ['job'])
  jobId: string;

  @Field(() => ID)
  @Validate(EntityExistingValidator, ['CV'])
  CVId: string;

  @Field({ nullable: true })
  description: string;
}
