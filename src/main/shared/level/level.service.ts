import { BaseService } from '@enouvo-packages/base-nestjs-api';
import { Injectable } from '@nestjs/common';

import { Level } from '@/db/entities/Level';

@Injectable()
export class LevelService extends BaseService<Level> {
  constructor() {
    super(Level);
  }
}
