import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { join } from 'path';

import { JobAdminModule } from '../admin/job/job.module';
import { UserAdminModule } from '../admin/user/user.module';
import { CompanyAddressModule } from '../shared/address/companyAddress.module';
import { LevelModule } from '../shared/level/level.module';
import { SkillModule } from '../shared/skill/skill.module';
import { StripeModule } from '../shared/stripe/stripe.module';
import { UploadModule } from '../shared/upload/upload.module';
import { UserModule } from '../shared/user/user.module';
import { AuthClientModule } from './auth/auth.module';
import { CompanyClientModule } from './company/company.module';
import { CVClientModule } from './cv/cv.module';
import { JobClientModule } from './job/job.module';
import { UserJobModule } from './userJob/userJob.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: '/client',
      autoSchemaFile: join(process.cwd(), 'schemaClient.gql'),
      sortSchema: true,
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: any = {
          statusCode: error.extensions?.exception?.code || 500,
          message: error.message
        };
        return graphQLFormattedError;
      },
      include: [
        UserModule,
        AuthClientModule,
        JobClientModule,
        CompanyClientModule,
        UserJobModule,
        SkillModule,
        LevelModule,
        CVClientModule,
        UserJobModule,
        UploadModule,
        CompanyAddressModule,
        UserAdminModule,
        JobAdminModule,
        StripeModule
      ]
    }),
    UserModule,
    AuthClientModule,
    JobClientModule,
    CompanyClientModule,
    UserJobModule,
    SkillModule,
    LevelModule,
    CVClientModule,
    UserJobModule,
    UploadModule,
    CompanyAddressModule,
    UserAdminModule,
    JobAdminModule,
    StripeModule
  ]
})
export class ClientModule {}
