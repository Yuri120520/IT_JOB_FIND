import { BadRequestException } from '@nestjs/common';
import { EntityManager, getManager } from 'typeorm';

import { User } from '@/db/entities/User';
import { messageKey } from '@/i18n';

export class GetUserQuery {
  static async getOneByEmail(email: string, throwErrorIfNotExists = true) {
    const user = await User.findOne({ where: { email } });

    if (!user && throwErrorIfNotExists) {
      throw new BadRequestException(messageKey.BASE.INVALID_EMAIL);
    }

    return user;
  }

  // static async getOneByResetPasswordToken(token: string) {
  //   const user = await User.findOne({ where: { resetPasswordToken: token } });

  //   if (!user) {
  //     throw new BadRequestException(messageKey.BASE.PASSWORD_TOKEN_EXPIRE);
  //   }

  //   return user;
  // }

  static async getUserById(id: string, throwErrorIfNotExists = true, transaction?: EntityManager) {
    const trx = transaction ?? getManager();
    const user = trx.getRepository(User).findOne({ id });

    if (!user && throwErrorIfNotExists) {
      throw new BadRequestException(messageKey.BASE.DATA_NOT_FOUND);
    }

    return user;
  }
}
