import { PaginationInterface } from '@enouvo-packages/base-nestjs-api';
import { ObjectType } from '@nestjs/graphql';

import { CompanyAddress } from '@/db/entities/CompanyAddress';

@ObjectType({ isAbstract: true })
export class ICompanyAddress extends CompanyAddress {}

@ObjectType({ isAbstract: true })
export class ICompanyAddresses extends PaginationInterface<ICompanyAddress>(ICompanyAddress) {}
