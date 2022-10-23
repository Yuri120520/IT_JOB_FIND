import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Gender, ROLE } from '@/common/constant';

export interface SendCodeVerifyInput {
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  gender?: Gender;
  role: ROLE;
  companyName?: string;
  companySkillIds?: string[];
  companyAddress?: string;
}

@ObjectType({ isAbstract: true })
export class RefreshResponse {
  @Field()
  accessToken: string;
}

@ObjectType({ isAbstract: true })
export class LoginResponse {
  @Field(() => ID)
  id: number;

  @Field()
  fullName: string;

  @Field()
  email: string;

  @Field()
  token: string;

  @Field()
  refreshToken: string;

  //   @Field(() => ID, { nullable: true })
  //   roleId: number;

  //   @Field({ nullable: true })
  //   avatar: string;

  //   @Field({ nullable: true })
  //   facebookId: string;

  //   @Field({ nullable: true })
  //   googleId: string;
}
