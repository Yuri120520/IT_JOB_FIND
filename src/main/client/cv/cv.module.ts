import { Module } from '@nestjs/common';

import { CVClientResolver } from './cv.resolver';
import { CVClientService } from './cv.service';

import { CVModule } from '@/main/shared/cv/cv.module';
import { CVResolver } from '@/main/shared/cv/cv.resolver';

@Module({
  providers: [CVClientResolver, CVClientService, CVResolver],
  imports: [CVModule]
})
export class CVClientModule {}
