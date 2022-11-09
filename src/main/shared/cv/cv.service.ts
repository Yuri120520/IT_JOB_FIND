import { BaseService } from '@enouvo-packages/base-nestjs-api';
import { Injectable } from '@nestjs/common';

import { CV } from '@/db/entities/CV';

@Injectable()
export class CVService extends BaseService<CV> {
  constructor() {
    super(CV);
  }
}
