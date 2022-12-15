import { BaseService } from '@enouvo-packages/base-nestjs-api';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CV } from '@/db/entities/CV';
import { messageKey } from '@/i18n';

@Injectable()
export class CVService extends BaseService<CV> {
  constructor() {
    super(CV);
  }

  static async getOneById(id: string, throwErrorIdNotExists = true) {
    const cv = await CV.findOne({ id });

    if (!cv && throwErrorIdNotExists) {
      throw new NotFoundException(messageKey.BASE.DATA_NOT_FOUND);
    }
    return cv;
  }
}
