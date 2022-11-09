import { PaginationInterface } from '@enouvo-packages/base-nestjs-api';
import { ObjectType } from '@nestjs/graphql';

import { CV } from '@/db/entities/CV';

@ObjectType({ isAbstract: true })
export class ICV extends CV {}

@ObjectType({ isAbstract: true })
export class ICVs extends PaginationInterface(ICV)<ICV> {}
