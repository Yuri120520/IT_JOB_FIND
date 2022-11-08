import { Module } from '@nestjs/common';

import { UserJobResolver } from './userJob.resolver';
import { UserJobService } from './userJob.service';

@Module({
  providers: [UserJobResolver, UserJobService]
})
export class UserJobModule {}
