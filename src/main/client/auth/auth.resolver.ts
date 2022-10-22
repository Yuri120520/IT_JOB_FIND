import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthClientService } from './auth.service';

import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { Public } from '@/decorators/public.decorator';
import { Context, GetContext } from '@/decorators/user.decorator';
import {
  CodeVerifyDto,
  RefreshTokenDto,
  ResendCodeVerifyDto,
  SignInDto,
  SignInGoogle,
  SignOutDto,
  SignUpDto
} from '@/main/shared/auth/dto';
import { LoginResponse, RefreshResponse } from '@/main/shared/auth/interface';
import { ChangePasswordInput } from '@/main/shared/user/dto';
import { UserService } from '@/main/shared/user/user.service';

@Resolver()
@Public()
export class AuthClientResolver {
  constructor(private readonly service: AuthClientService, private readonly userService: UserService) {}

  @Mutation(() => LoginResponse, { name: `signIn` })
  async signIn(@Args('input') input: SignInDto) {
    return await this.service.signIn(input);
  }

  @Mutation(() => ResponseMessageBase, { name: `signOut` })
  async signOut(@Args('input') input: SignOutDto) {
    return await this.service.logout(input);
  }

  @Mutation(() => RefreshResponse, { name: `refreshToken` })
  async refreshToken(@Args('input') input: RefreshTokenDto) {
    return await this.service.refreshToken(input);
  }

  @Mutation(() => ResponseMessageBase, { name: `signUp` })
  async signUp(@Args('input') input: SignUpDto) {
    return await this.service.signUp(input);
  }

  @Mutation(() => ResponseMessageBase, { name: `resendCodeVerify` })
  async resendCodeVerify(@Args('input') input: ResendCodeVerifyDto) {
    return await this.service.resendCodeVerify(input);
  }

  @Mutation(() => LoginResponse, { name: `verifyCode` })
  async verifyCode(@Args('input') input: CodeVerifyDto) {
    return await this.service.verifyCode(input);
  }

  @Mutation(() => LoginResponse, { name: `signInGoogle` })
  async signInGoogle(@Args('input') input: SignInGoogle) {
    return await this.service.signInGoogle(input);
  }

  @Mutation(() => ResponseMessageBase, { name: 'changePassword' })
  async changePassword(
    @Args('changePasswordInput') changePasswordInput: ChangePasswordInput,
    @GetContext() ctx: Context
  ) {
    return this.userService.changePassword(changePasswordInput, ctx);
  }
}
