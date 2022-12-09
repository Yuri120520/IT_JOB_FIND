import { EmailService } from '.';

import { configuration } from '@/config/index';
import { Company } from '@/db/entities/Company';
import { Job } from '@/db/entities/Job';
import { User } from '@/db/entities/User';

class EmailFunctions extends EmailService {
  async sendEmailResetPassword(receiverEmail: string, resetPasswordCode: string) {
    const subject = 'Mojosa - Reset your password';
    const html = `<p>Your reset password code is: <b>${resetPasswordCode}</b> </p>`;
    return await this.sendEmail({
      receiverEmail,
      subject,
      html
    });
  }

  async sendEmailAssessmentInvitation(receiverEmail: string, restPasswordTokenLink: string) {
    const subject = 'Rent App - Invitation';
    const html = `<p>Thanks you for complete questionnaire. You have one invitation to register for new account ${receiverEmail}. Click this link to set your password <a href=${restPasswordTokenLink} target="_blank">Click here</a></p>`;
    return await this.sendEmail({
      receiverEmail,
      subject,
      html
    });
  }

  async sendEmailVerify(receiverEmail: string, fullName: string, code: string) {
    const subject = '[IT JOB FIND] Verify your new email';

    const html = `    
    <p>Dear ${fullName},</p>

    <p>Thanks for signing up! 👋</p>
    <p>To complete the registration, simply go back to the browser window where you started creating your account and enter this code:<br> <b>${code}</b></p>
    <p>If you did not sign up to ThePerfectScore, please ignore this email or contact us at support@example.com</p>
    
    <p>Best Regards,</p>
    <b>IT JOB FIND</b>
    `;
    return await this.sendEmail({
      receiverEmail,
      subject,
      html
    });
  }

  async sendEmailApplyJobToEmployee(receiver: User, job: Job) {
    const subject = '[IT JOB FIND] Apply job successfully!';

    const html = `    
    <p>Dear ${receiver.fullName},</p>

    <p>Congratulation!</p>
    <p>You have applied for <b>${job.description.title}</b> position of <b>${job.company.name}</b>. </p>
    <p>Please wait for a response from the company</p>
    
    <p>Best Regards,</p>
    <b>IT JOB FIND</b>
    `;
    return await this.sendEmail({
      receiverEmail: receiver.email,
      subject,
      html
    });
  }
  async sendEmailApplyJobToEmployer(company: Company, job: Job) {
    const subject = '[IT JOB FIND] New application!';

    const html = `    
    <p>Dear ${company.name},</p>

    <p>Your job has a new application. Please check and respond to that application.</p>
    <p> Click the <a href='${configuration.api.clientWebsite}/employer/job-management/${job.id}'>link</a> to see the details.</p>   
    
    <p>Best Regards,</p>
    <b>IT JOB FIND</b>
    `;
    return await this.sendEmail({
      receiverEmail: company.user.email,
      subject,
      html
    });
  }

  async sendEmailPostJobSuccessFully(company: Company, job: Job) {
    const subject = '[IT JOB FIND] Post job successfully!';

    const html = `    
    <p>Dear ${company.name},</p>

    <p>Congratulation.</p>
    <p> You have successfully applied for a job. Please click <a href='${configuration.api.clientWebsite}/employer/job-management/${job.id}'>link</a> to check details. </p>

    <p>Note that we may deactivate posts if violations are found. At the same time, when it runs out, the post will be automatically closed.</p>   
    
    <p>Best Regards,</p>
    <b>IT JOB FIND</b>
    `;
    return await this.sendEmail({
      receiverEmail: company.user.email,
      subject,
      html
    });
  }
  async sendEmailPostJobFail(company: Company) {
    const subject = '[IT JOB FIND] Post job failed!';

    const html = `    
    <p>Dear ${company.name},</p>

    <p>We're sorry to announce that your job posting has failed because you haven't paid the transaction.</p>
    <p>You can re-do another transaction to post job.</p>
    
    <p>Best Regards,</p>
    <b>IT JOB FIND</b>
    `;
    return await this.sendEmail({
      receiverEmail: company.user.email,
      subject,
      html
    });
  }
  async sendEmailAcceptedApplication(user: User, job: Job) {
    const subject = '[IT JOB FIND] Application has been accepted!';

    const html = `    
    <p>Dear ${user.fullName},</p>

    <p>Congratulation.</p>
    <p>Your application <b>${job.description.title}</b> of <b>${job.company.name}</b> has been accepted. Please check for details on the recruitment process from the company.</p>
    
    <p>Best Regards,</p>
    <b>IT JOB FIND</b>
    `;
    return await this.sendEmail({
      receiverEmail: user.email,
      subject,
      html
    });
  }

  async sendEmailRejectedApplication(user: User, job: Job) {
    const subject = '[IT JOB FIND] Application has not been accepted';

    const html = `    
    <p>Dear ${user.fullName},</p>

    <p>We are sorry to inform you that your application <b>${job.description.title}</b> of <b>${job.company.name}</b> has not been accepted by the company. Thank you for your interest in this job.</p>
    
    <p>Best Regards,</p>
    <b>IT JOB FIND</b>
    `;
    return await this.sendEmail({
      receiverEmail: user.email,
      subject,
      html
    });
  }
}

export const emailService = new EmailFunctions();
