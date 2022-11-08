import { PaginationInterface } from '@enouvo-packages/base-nestjs-api';
import { ObjectType } from '@nestjs/graphql';

import { Skill } from '@/db/entities/Skill';

@ObjectType({ isAbstract: true })
export class ISkill extends Skill {}

@ObjectType({ isAbstract: true })
export class ISkills extends PaginationInterface(ISkill)<ISkill> {}
