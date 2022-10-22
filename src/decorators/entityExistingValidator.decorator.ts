import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isNil, uniq } from 'lodash';
import { getManager } from 'typeorm';

import { CACHE_NAMESPACE, RedisClientSingleton } from '@/services/redis/redis';

@ValidatorConstraint({})
export class EntityExistingValidator implements ValidatorConstraintInterface {
  async validate(input: (string | number) | (string | number)[], args: ValidationArguments) {
    console.log('==========', input);
    if (isNil(input)) {
      return true;
    }

    if (!args.constraints?.length) {
      return false;
    }

    const entityIds = Array.isArray(input) ? uniq(input) : [input];
    const totalExistingEntities = await RedisClientSingleton.getInstance().get(
      CACHE_NAMESPACE.Entity,
      entityIds.join(),
      async () =>
        await getManager().getRepository(args.constraints[0]).createQueryBuilder().whereInIds(entityIds).getCount()
    );

    return totalExistingEntities == entityIds.length;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.constraints?.[0]} is not found.`;
  }
}
