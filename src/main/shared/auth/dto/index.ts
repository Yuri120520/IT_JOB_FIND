import { Field, ID, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsEmail, IsEnum, IsString, Validate } from 'class-validator';

import { Gender } from '@/common/constant';
import { EntityExistingValidator } from '@/decorators/entityExistingValidator.decorator';
import { PasswordValidator } from '@/providers/validation/passwordValidator';

@InputType()
export class SignUpDto {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @Validate(PasswordValidator)
  password: string;

  @Field()
  fullName: string;

  @Field({ nullable: true })
  phoneNumber: string;

  @Field(() => Gender, { nullable: true })
  @IsEnum(Gender)
  gender: Gender;
}

@InputType()
export class CodeVerifyDto {
  @Field()
  verifyCode: string;

  @Field()
  @IsEmail()
  email: string;
}

@InputType()
export class SignInDto {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class RefreshTokenDto {
  @Field()
  refreshToken: string;
}

@InputType()
export class SignOutDto extends RefreshTokenDto {}

@InputType()
export class ForgotPasswordDto {
  @Field()
  email: string;
}

@InputType()
export class ResetPasswordDto {
  @Field()
  token: string;

  @Field()
  @Validate(PasswordValidator)
  password: string;
}

@InputType()
export class ResendCodeVerifyDto {
  @Field()
  @IsEmail()
  email: string;
}

@InputType()
export class SignInGoogle {
  @Field()
  @IsString()
  idToken: string;

  @Field(() => ID)
  @Validate(EntityExistingValidator, ['role'])
  roleId: string;

  @Field({ nullable: true })
  @IsString()
  fullName: string;

  @Field({ nullable: true })
  @IsString()
  phoneNumber?: string;
}

@InputType()
export class SignUpForEmployerDto {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Validate(PasswordValidator)
  password: string;

  @Field()
  phoneNumber: string;

  @Field()
  companyName: string;

  @Field(() => [ID])
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @Validate(EntityExistingValidator, ['skill'])
  companySkillIds: string[];

  @Field()
  companyAddress: string;
}
