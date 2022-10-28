import { registerEnumType } from '@nestjs/graphql';

import { Gender } from '@/common/constant';

registerEnumType(Gender, { name: 'Gender' });
