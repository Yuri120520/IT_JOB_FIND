import { Injectable, NotFoundException } from '@nestjs/common';

import { UpsertCVDto } from './dto';

import { CV } from '@/db/entities/CV';
import { messageKey } from '@/i18n';
import { CVService } from '@/main/shared/cv/cv.service';

@Injectable()
export class CVClientService extends CVService {
  async upsertCV(userId: string, input: UpsertCVDto) {
    const { id, ...data } = input;
    const existingCV = await CV.findOne({ id });

    const mergingCV = CV.merge(existingCV ?? CV.create(), { ...data, userId });

    return await CV.save(mergingCV);
  }

  async deleteCV(userId: string, cvId: string) {
    const cv = await CV.findOne({ id: cvId, userId });

    if (!cv) {
      throw new NotFoundException(messageKey.BASE.DATA_NOT_FOUND);
    }

    await CV.createQueryBuilder().delete().where({ id: cvId }).execute();
    return { message: messageKey.BASE.SUCCESSFULLY, success: true };
  }
}
