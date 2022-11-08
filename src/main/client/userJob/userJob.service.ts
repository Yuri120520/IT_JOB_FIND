import { BaseService } from '@enouvo-packages/base-nestjs-api';
import { Injectable } from '@nestjs/common';

import { UserJob } from '@/db/entities/UserJob';

@Injectable()
export class UserJobService extends BaseService<UserJob> {
  constructor() {
    super(UserJob);
  }
}
