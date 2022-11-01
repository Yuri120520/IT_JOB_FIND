import { Module } from '@nestjs/common';

import { CompanyClientResolver } from './company.resolver';
import { CompanyClientService } from './company.service';

import { CompanyModule } from '@/main/shared/company/company.module';
import { CompanyResolver } from '@/main/shared/company/company.resolver';

@Module({
  providers: [CompanyClientResolver, CompanyClientService, CompanyResolver],
  imports: [CompanyModule]
})
export class CompanyClientModule {}
