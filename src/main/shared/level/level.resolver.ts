import { BaseResolver } from '@enouvo-packages/base-nestjs-api';
import { Resolver } from '@nestjs/graphql';

import { ILevel, ILevels } from './interface';
import { LevelService } from './level.service';

import { Level } from '@/db/entities/Level';

@Resolver()
export class LevelResolver extends BaseResolver<ILevels, ILevel>({
  getAllBase: ILevels,
  getOneBase: ILevel,
  classRef: Level.name
}) {
  constructor(private service: LevelService) {
    super(service);
  }
}
