import { BaseResolver } from '@enouvo-packages/base-nestjs-api';
import { Resolver } from '@nestjs/graphql';

import { CVService } from './cv.service';
import { ICV, ICVs } from './interface';

import { CV } from '@/db/entities/CV';

@Resolver()
export class CVResolver extends BaseResolver<ICVs, ICV>({
  getAllBase: ICVs,
  getOneBase: ICV,
  classRef: CV.name
}) {
  constructor(private service: CVService) {
    super(service);
  }
}
