import { BaseService } from '@enouvo-packages/base-nestjs-api';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { UpsertCVDto } from './dto';

import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { CV } from '@/db/entities/CV';
import { messageKey } from '@/i18n';

@Injectable()
export class CVService extends BaseService<CV> {
  constructor() {
    super(CV);
  }
  async upsertCV(userId: string, input: UpsertCVDto) {
    const { id } = input;

    const existingCV = await CVService.getOneById(id, false);

    const mergingCV = CV.merge(existingCV ?? CV.create(), { ...input, userId });
    return await CV.save(mergingCV);
  }

  async deleteOne(userId: string, id: string): Promise<ResponseMessageBase> {
    const cv = await CVService.getOneById(id, true);
    if (cv.userId !== userId) {
      throw new BadRequestException(messageKey.BASE.NOT_PERMISSION);
    }
    if (cv.isUsed) {
      throw new BadRequestException(messageKey.BASE.CV_CAN_NOT_DELETE);
    }

    await CV.delete(id);

    return { message: messageKey.BASE.SUCCESSFULLY, success: true };
  }

  static async getOneById(id: string, throwErrorIdNotExists = true) {
    const cv = await CV.findOne(id);

    if (!cv && throwErrorIdNotExists) {
      throw new NotFoundException(messageKey.BASE.DATA_NOT_FOUND);
    }
    return cv;
  }
}
