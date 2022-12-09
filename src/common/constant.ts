/* eslint-disable @typescript-eslint/naming-convention */
export const contentTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

export const SQS_API_VERSION = '2012-11-05';
export const DEFAULT_DELAY_IN_SECONDS = 0;

export const APP_ENV = {
  LOCAL: 'local',
  STAGING: 'staging',
  UAT: 'uat',
  PROD: 'prod',
  TEST: 'test'
};

export enum S3_UPLOAD_TYPE {
  Public = 'Public',
  Profile = 'Profile'
}

export enum ROLE {
  ADMIN = 'Admin',
  USER = 'User',
  EMPLOYER = 'Employer'
}

export enum EmailType {
  SEND_MAIL_INVITATION = 'SEND_MAIL_INVITATION',
  SEND_MAIL_VERIFY_CODE = 'SEND_MAIL_VERIFY_CODE',
  SEND_MAIL_RESET_PASSWORD = 'SEND_MAIL_RESET_PASSWORD'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  NON_BINARY = 'Non-binary'
}

export enum UserVerificationRequestType {
  EMAIL_VERIFICATION = 'Email verification',
  CHANGE_PASSWORD = 'Change password',
  RESET_PASSWORD = 'Reset password'
}

export const MAX_SALARY = 10000;
export const MIN_SALARY = 0;

export const POST_INTERVAL_COST = {
  one_month: 10,
  two_months: 18,
  three_months: 25
};

export const CONTENT_TYPE_OPEN_XML_FORMATS = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
