import { Module } from '@nestjs/common';

import { CompanyAddressResolver } from './companyAddress.resolver';
import { CompanyAddressService } from './companyAddress.service';

@Module({
  providers: [CompanyAddressResolver, CompanyAddressService]
})
export class CompanyAddressModule {}
