import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsUrl, IsUUID, Validate } from 'class-validator';

import { EntityExistingValidator } from '@/decorators/entityExistingValidator.decorator';

@InputType()
export class UpsertCVDto {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  @Validate(EntityExistingValidator, ['cv'])
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  url: string;
}
