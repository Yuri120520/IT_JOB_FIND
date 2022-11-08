import { Module } from '@nestjs/common';

import { LevelResolver } from './level.resolver';
import { LevelService } from './level.service';

@Module({
  providers: [LevelResolver, LevelService]
})
export class LevelModule {}
