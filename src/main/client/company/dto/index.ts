import { Field, ID, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  Validate,
  ValidateNested
} from 'class-validator';

import { EntityExistingValidator } from '@/decorators/entityExistingValidator.decorator';

@InputType()
export class UpdateCompanyAddressDto {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @Validate(EntityExistingValidator, ['company_address'])
  id: string;

  @Field()
  @IsNotEmpty()
  detail: string;
}

@InputType()
export class UpdateCompanyProfileDto {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  website: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  size: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  benefits: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  images: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  certificates: string[];

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @Validate(EntityExistingValidator, ['skill'], { each: true })
  skillIds: string[];

  @Field(() => [UpdateCompanyAddressDto], { nullable: true })
  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateCompanyAddressDto)
  addresses: UpdateCompanyAddressDto[];
}
