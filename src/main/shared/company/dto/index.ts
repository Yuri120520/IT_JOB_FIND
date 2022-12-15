import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

import { JobFilterDto } from '../../job/dto';

@InputType()
export class CompanyFilterDto extends PickType(JobFilterDto, ['addresses', 'skillIds']) {
  @Field({ nullable: true })
  @IsOptional()
  name: string;
}
