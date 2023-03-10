import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { Gender } from '@/common/constant';

@InputType()
export class UserUpdateInput {
  @Field({ nullable: true })
  @IsOptional()
  firstName: string;

  @Field({ nullable: true })
  @IsOptional()
  lastName: string;

  @Field({ nullable: true })
  @IsOptional()
  phoneNumber: string;

  @Field(() => Gender, { nullable: true })
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @Field(() => String, { nullable: true })
  @IsString()
  avatar: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  password: string;

  @Field()
  newPassword: string;
}

@InputType()
export class ChangeStatusOfUserInput {
  @Field(() => ID)
  @IsUUID()
  userId: string;

  @Field(() => Boolean)
  isActive: boolean;
}
