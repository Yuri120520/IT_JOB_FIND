import { BaseResolver } from '@enouvo-packages/base-nestjs-api';
import { Resolver } from '@nestjs/graphql';

import { CompanyAddressService } from './companyAddress.service';
import { ICompanyAddress, ICompanyAddresses } from './interface/index';

import { CompanyAddress } from '@/db/entities/CompanyAddress';

@Resolver()
export class CompanyAddressResolver extends BaseResolver<ICompanyAddresses, ICompanyAddresses>({
  getAllBase: ICompanyAddresses,
  getOneBase: ICompanyAddress,
  classRef: CompanyAddress.name
}) {
  constructor(private service: CompanyAddressService) {
    super(service);
  }
}
