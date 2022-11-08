import { BaseService } from '@enouvo-packages/base-nestjs-api';
import { Injectable } from '@nestjs/common';

import { Skill } from '@/db/entities/Skill';

@Injectable()
export class SkillService extends BaseService<Skill> {
  constructor() {
    super(Skill);
  }
}
