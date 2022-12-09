import { Field, ObjectType } from '@nestjs/graphql';
import { Request } from 'express';

@ObjectType({ isAbstract: true })
export class CreateStripeCheckoutResponse {
  @Field(() => String, { nullable: false })
  paymentUrl: string;
}
export interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}
