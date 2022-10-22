import { registerEnumType } from '@nestjs/graphql';

import { Gender, ROLE } from '@/common/constant';

registerEnumType(Gender, { name: 'Gender' });

registerEnumType(ROLE, { name: 'ROLE' });
