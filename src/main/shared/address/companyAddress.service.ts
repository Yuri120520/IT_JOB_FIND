import { BaseService } from '@enouvo-packages/base-nestjs-api';
import { Injectable } from '@nestjs/common';

import { CompanyAddress } from '@/db/entities/CompanyAddress';

@Injectable()
export class CompanyAddressService extends BaseService<CompanyAddress> {
  constructor() {
    super(CompanyAddress);
  }
}
