import { BaseResolver } from '@enouvo-packages/base-nestjs-api';
import { Resolver } from '@nestjs/graphql';

import { ISkill, ISkills } from './interface';
import { SkillService } from './skill.service';

import { Skill } from '@/db/entities/Skill';

@Resolver()
export class SkillResolver extends BaseResolver<ISkills, ISkill>({
  getAllBase: ISkills,
  getOneBase: ISkill,
  classRef: Skill.name
}) {
  constructor(private service: SkillService) {
    super(service);
  }
}
