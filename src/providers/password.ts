import { BadRequestException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

import { configuration } from '@/config';
import { messageKey } from '@/i18n';

export class PasswordUtil {
  static async generateHash(password: string): Promise<string> {
    return await bcryptjs.hash(password, Number(configuration.bcrypt.salt));
  }

  static async validateHash(password: string, hash: string, throwErrorIfNotMatch = true) {
    const isMatched = await bcryptjs.compare(password, hash);

    if (!isMatched && throwErrorIfNotMatch) {
      throw new BadRequestException(messageKey.BASE.INCORRECT_EMAIL_OR_PASSWORD);
    }

    if (isMatched && !throwErrorIfNotMatch) {
      throw new BadRequestException(messageKey.BASE.NEW_PASSWORD_DIFFERENT_OLD_PASSWORD);
    }
  }
}
