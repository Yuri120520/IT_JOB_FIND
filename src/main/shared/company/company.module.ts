import { Module } from '@nestjs/common';

import { CompanyResolver } from './company.resolver';
import { CompanyService } from './company.service';

@Module({
  providers: [CompanyResolver, CompanyService],
  exports: [CompanyResolver, CompanyService]
})
export class CompanyModule {}
