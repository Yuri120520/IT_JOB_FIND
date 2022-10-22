import { Injectable } from '@nestjs/common';

import { AuthService } from '@/main/shared/auth/auth.service';
import {
  CodeVerifyDto,
  RefreshTokenDto,
  ResendCodeVerifyDto,
  SignInDto,
  SignInGoogle,
  SignOutDto,
  SignUpDto
} from '@/main/shared/auth/dto';

@Injectable()
export class AuthClientService {
  constructor(private readonly authService: AuthService) {}

  async signIn(input: SignInDto) {
    return this.authService.signIn(input);
  }

  async logout(input: SignOutDto) {
    return this.authService.signOut(input);
  }

  async refreshToken(input: RefreshTokenDto) {
    return this.authService.refreshToken(input);
  }

  async signUp(input: SignUpDto) {
    return this.authService.SignUp(input);
  }

  async resendCodeVerify(input: ResendCodeVerifyDto) {
    return this.authService.resendCodeVerify(input);
  }

  async verifyCode(input: CodeVerifyDto) {
    return this.authService.verifyCode(input);
  }

  async signInGoogle(input: SignInGoogle) {
    return this.authService.signInWithGoogle(input);
  }
}
