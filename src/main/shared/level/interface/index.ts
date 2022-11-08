import { PaginationInterface } from '@enouvo-packages/base-nestjs-api';
import { ObjectType } from '@nestjs/graphql';

import { Level } from '@/db/entities/Level';

@ObjectType({ isAbstract: true })
export class ILevel extends Level {}

@ObjectType({ isAbstract: true })
export class ILevels extends PaginationInterface(ILevel)<ILevel> {}
