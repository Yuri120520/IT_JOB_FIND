import { PaginationInterface } from '@enouvo-packages/base-nestjs-api';
import { ObjectType } from '@nestjs/graphql';

import { Company } from '@/db/entities/Company';

@ObjectType({ isAbstract: true })
export class ICompany extends Company {}

@ObjectType({ isAbstract: true })
export class ICompanies extends PaginationInterface<ICompany>(ICompany) {}
