import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CreateStripeCheckoutSessionDto } from './dto';
import { CreateStripeCheckoutResponse } from './interface';
import { StripeService } from './stripe.service';

import { ROLE } from '@/common/constant';
import { Auth } from '@/decorators/auth.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { Context, GetContext } from '@/decorators/user.decorator';

@Resolver()
export class StripeResolver {
  constructor(private paymentService: StripeService) {}

  @Roles(ROLE.EMPLOYER)
  @Auth(['role'])
  @Mutation(() => CreateStripeCheckoutResponse, { name: 'createStripeCheckoutSession' })
  async createStripeCheckoutSession(@GetContext() ctx: Context, @Args('input') input: CreateStripeCheckoutSessionDto) {
    const { currentUser } = ctx;
    return await this.paymentService.createStripeCheckoutSession(currentUser.id, input);
  }
}
