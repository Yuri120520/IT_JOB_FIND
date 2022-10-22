import { BadRequestException, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { OAuth2Client } from 'google-auth-library';
import { pick, random } from 'lodash';
import { EntityManager, getManager } from 'typeorm';

import { GetUserQuery } from '../user/query/getUser.query';
import { UserService } from '../user/user.service';
import { UserVerificationRequestQuery } from '../userVerificationRequest/query/getUserVerificationRequest.query';
import {
  CodeVerifyDto,
  RefreshTokenDto,
  ResendCodeVerifyDto,
  SignInDto,
  SignInGoogle,
  SignOutDto,
  SignUpDto
} from './dto';
import { SendCodeVerifyInput } from './interface';

import { ROLE, UserVerificationRequestType } from '@/common/constant';
import { Role } from '@/db/entities/Role';
import { Token } from '@/db/entities/Token';
import { User } from '@/db/entities/User';
import { UserVerificationRequest } from '@/db/entities/UserVerificationRequest';
import { messageKey } from '@/i18n';
import { PasswordUtil } from '@/providers/password';
import { Jwt } from '@/services/jwt/jwt';
import { emailService } from '@/services/smtp/services';

@Injectable()
export class AuthService {
  private SELECT_USER = ['fullName', 'email', 'id', 'roleId', 'phoneNumber', 'role', 'avatar'];

  constructor(private userService: UserService) {}

  async SignUp(input: SignUpDto) {
    const { email, password, role } = input;

    if (role === ROLE.ADMIN) {
      throw new BadRequestException(messageKey.BASE.EMAIL_EXIST);
    }

    const user = await GetUserQuery.getOneByEmail(email, false);

    if (user) {
      throw new BadRequestException(messageKey.BASE.EMAIL_EXIST);
    }
    const { id } = await Role.findOne({ name: role });
    const hashPassword = await PasswordUtil.generateHash(password);

    return AuthService.sendCodeVerify({
      ...input,
      password: hashPassword,
      roleId: id
    });
  }

  static async sendCodeVerify(input: SendCodeVerifyInput, transaction?: EntityManager) {
    const trx = transaction ?? getManager();
    const { email, fullName } = input;

    const verifyCode = String(random(100000, 999999));
    const expirationTime = dayjs(new Date()).add(5, 'minutes').toDate();
    const data = input as unknown as JSON;

    const userVerificationRequest = UserVerificationRequest.merge(
      (await UserVerificationRequest.findOne({ where: { email } })) ?? UserVerificationRequest.create(),
      { email, code: verifyCode, data, expirationTime, type: UserVerificationRequestType.EMAIL_VERIFICATION }
    );

    await trx.getRepository(UserVerificationRequest).save(userVerificationRequest);

    await emailService.sendEmailVerify(email, fullName, verifyCode);

    return {
      success: true,
      message: messageKey.BASE.SUCCESSFULLY
    };
  }

  async resendCodeVerify(input: ResendCodeVerifyDto) {
    const { email } = input;

    let userVerificationRequest = await UserVerificationRequestQuery.getOneByEmail(email);

    const user = await GetUserQuery.getOneByEmail(email, false);

    if (user) {
      throw new BadRequestException(messageKey.BASE.INVALID_EMAIL);
    }

    const data = userVerificationRequest.data as unknown as SendCodeVerifyInput;
    const { fullName } = data;

    const verifyCode = String(random(100000, 999999));
    const expirationTime = dayjs(new Date()).add(5, 'minutes').toDate();

    userVerificationRequest = UserVerificationRequest.merge(userVerificationRequest, {
      code: verifyCode,
      expirationTime
    });

    await UserVerificationRequest.save(userVerificationRequest);

    await emailService.sendEmailVerify(email, fullName, verifyCode);

    return {
      success: true,
      message: messageKey.BASE.SUCCESSFULLY
    };
  }

  async verifyCode(input: CodeVerifyDto) {
    const { verifyCode, email } = input;

    const userVerificationRequest = await UserVerificationRequestQuery.verify(email, verifyCode);

    const data = userVerificationRequest.data as unknown as SendCodeVerifyInput;
    let user = await GetUserQuery.getOneByEmail(email, false);

    if (user) {
      return user;
    }

    return await getManager().transaction(async transaction => {
      user = User.create({ ...data, isActive: true });

      await transaction.getRepository(User).save(user);

      return await this.generateUserWithAccessToken(user, transaction);
    });
  }

  async signIn(input: SignInDto) {
    const { email, password } = input;

    const user = await User.createQueryBuilder().where({ email }).leftJoinAndSelect('User.role', 'Role').getOne();

    if (!user) {
      throw new BadRequestException(messageKey.BASE.INCORRECT_EMAIL_OR_PASSWORD);
    }

    await PasswordUtil.validateHash(password, user.password);

    return await getManager().transaction(
      async transaction => await this.generateUserWithAccessToken(user, transaction)
    );
  }

  async signOut(input: SignOutDto) {
    const { refreshToken } = input;

    await Token.createQueryBuilder().delete().where({ refreshToken }).execute();

    return {
      success: true,
      message: messageKey.BASE.DELETED_SUCCESSFULLY
    };
  }

  static getRefreshTokenExpireTime() {
    const REFRESH_TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60 * 60;

    return REFRESH_TOKEN_EXPIRE_TIME;
  }

  async refreshToken(input: RefreshTokenDto) {
    const { refreshToken } = input;

    const token = await Token.findOne({ where: { refreshToken } });

    if (!token || !token.userId) {
      throw new BadRequestException(messageKey.BASE.INVALID_REFRESH_TOKEN);
    }

    const refreshTokenExpire = AuthService.getRefreshTokenExpireTime();

    if (new Date(token.lastUsed).getTime() - Date.now() > refreshTokenExpire) {
      throw new BadRequestException(messageKey.BASE.REFRESH_TOKEN_EXPIRE);
    }

    const user = await User.createQueryBuilder()
      .where({ id: token.userId })
      .leftJoinAndSelect('User.role', 'Role')
      .getOne();

    if (!user || !user.isActive) {
      throw new BadRequestException(messageKey.BASE.INVALID_REFRESH_TOKEN);
    }

    const tokenIssueData = pick(user, this.SELECT_USER);
    const tokenizedData = { ...tokenIssueData };
    const accessToken = await Jwt.issue(tokenizedData);

    token.lastUsed = new Date();
    token.accessToken = accessToken;

    await token.save();

    return {
      accessToken
    };
  }

  async createAccessToken(user: Partial<User>, transaction?: EntityManager) {
    const trx = transaction ?? getManager();
    const tokenizedData = {
      ...user
    };
    const accessToken = await Jwt.issue(tokenizedData);
    const refreshToken = await Jwt.issueRefreshToken(tokenizedData);

    const newToken = trx
      .getRepository(Token)
      .create({ userId: user.id, email: user.email, refreshToken, accessToken, lastUsed: new Date() });

    await trx.getRepository(Token).save(newToken);

    return newToken;
  }

  async generateUserWithAccessToken(user: User, transaction?: EntityManager) {
    const trx = transaction ?? getManager();
    const data = pick(user, this.SELECT_USER);
    const token = await this.createAccessToken(User.create(user), trx);

    return {
      ...data,
      token: token.accessToken,
      refreshToken: token.refreshToken
    };
  }

  async signInWithGoogle(input: SignInGoogle) {
    const trx = getManager();
    const oauth2client = new OAuth2Client();
    const vefiedToken = await oauth2client
      .verifyIdToken({
        idToken: input.idToken
      })
      .catch(() => {
        throw new BadRequestException(messageKey.BASE.TOKEN_INVALID);
      });

    const response = await vefiedToken.getPayload();

    if (!response) {
      throw new BadRequestException(messageKey.BASE.DATA_NOT_FOUND);
    }

    const user = await GetUserQuery.getOneByEmail(response.email);

    if (user) {
      return await this.generateUserWithAccessToken(user, trx);
    }

    return await trx.transaction(async transaction => {
      const newUser = await User.create({
        email: response.email,
        roleId: input.roleId,
        fullName: input.fullName,
        googleId: response.sub,
        phoneNumber: input.phoneNumber
      });

      await transaction.getRepository(User).save(newUser);

      return await this.generateUserWithAccessToken(newUser, transaction);
    });
  }
}
