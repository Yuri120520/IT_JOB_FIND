import { Field, InputType } from '@nestjs/graphql';

import { UpsertJobDto } from '@/main/client/job/dto';

@InputType()
export class CreateStripeCheckoutSessionDto {
  @Field(() => UpsertJobDto)
  data: UpsertJobDto;

  @Field()
  successUrl: string;

  @Field()
  cancelUrl: string;
}
