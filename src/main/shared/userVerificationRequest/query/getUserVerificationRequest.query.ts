import { BadRequestException } from '@nestjs/common';
import dayjs from 'dayjs';

import { UserVerificationRequest } from '@/db/entities/UserVerificationRequest';
import { messageKey } from '@/i18n';

export class UserVerificationRequestQuery {
  static async verify(email: string, code: string) {
    const verificationRequest = await UserVerificationRequest.findOne({ where: { email, code } });

    if (
      !verificationRequest ||
      verificationRequest.code !== code ||
      dayjs().isAfter(dayjs(verificationRequest.expirationTime))
    ) {
      throw new BadRequestException(messageKey.BASE.CODE_INCORRECT_OR_EXPIRED);
    }

    return verificationRequest;
  }

  static async getOneByEmail(email: string) {
    const verificationRequest = await UserVerificationRequest.findOne({ where: { email } });

    if (!verificationRequest) {
      throw new BadRequestException(messageKey.BASE.INVALID_EMAIL);
    }

    return verificationRequest;
  }
}
