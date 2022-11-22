/* eslint-disable */
require('dotenv').config();

import { APP_ENV } from '../common/constant';

export const configuration = {
  api: {
    nodeEnv: process.env.APP_ENV || APP_ENV.LOCAL,
    clientWebsite: process.env.CLIENT_WEBSITE || '',
    adminWebsite: process.env.ADMIN_WEBSITE || ''
  },
  connectionString: process.env.DATABASE_URL,
  databaseLocal: process.env.DATABASE_URL || 'postgresql://postgres:12345678@localhost/it-job-find-db-local',
  databaseTest: process.env.DATABASE_URL || 'postgresql://postgres:12345678@localhost/it-job-find-db-local',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  sentryKey: process.env.SENTRY_DSN || '',
  aws: {
    region: process.env.REGION || 'ap-southeast-1',
    secretKey: process.env.AWS_SECRET_KEY,
    accessKey: process.env.AWS_ACCESS_KEY,
    s3BucketName: process.env.S3_BUCKET,
    mainQueueUrl: process.env.MAIN_QUEUE_URL
  },
  jwt: {
    secretKey: process.env.JWT_SECRET || 'it-job-find-2022',
    refreshSecretKey: process.env.JWT_REFRESH_SECRET || 'it-job-find-2022',
    expiredIn: '300s'
  },
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  domain: process.env.DOMAIN || 'localhost',
  port: process.env.PORT || 12345,
  timeout: process.env.TIME_OUT || 10000,
  bcrypt: {
    salt: process.env.SALT_ROUND || 5
  },
  smtpService: {
    service: process.env.SMTP_SERVICE || 'gmail',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: +process.env.SMTP_PORT || 465,
    user: process.env.SMTP_USER || `jtjob.find@gmail.com`,
    password: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'jtjob.find@gmail.com'
  }
};
