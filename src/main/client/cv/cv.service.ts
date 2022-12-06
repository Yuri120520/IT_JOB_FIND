import { BadRequestException, Injectable } from '@nestjs/common';

import { UpsertCVDto } from './dto';

import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { CV } from '@/db/entities/CV';
import { messageKey } from '@/i18n';
import { CVService } from '@/main/shared/cv/cv.service';

@Injectable()
export class CVClientService extends CVService {
  async upsertCV(userId: string, input: UpsertCVDto) {
    const { id, name } = input;

    if (name) {
      const builder = await CV.createQueryBuilder('cv').where(`LOWER(name) = :name AND cv.userId = :userId`, {
        name: name.toLowerCase(),
        userId
      });

      if (id) builder.andWhere(`id != :id`, { id });
      const existedCV = await builder.getOne();

      if (existedCV) {
        throw new BadRequestException(messageKey.BASE.CV_IS_ALREADY_EXISTED);
      }
    }
    const cv = id ? await CVService.getOneById(id) : await CV.create();
    await CV.merge(cv, { ...input, userId }).save();
    return { message: messageKey.BASE.SUCCESSFULLY, success: true };
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
}
