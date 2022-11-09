import { Module } from '@nestjs/common';

import { CVResolver } from './cv.resolver';
import { CVService } from './cv.service';

@Module({
  providers: [CVResolver, CVService],
  exports: [CVResolver, CVService]
})
export class CVModule {}
