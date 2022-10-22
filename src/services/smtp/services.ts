import { EmailService } from '.';

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
}

export const emailService = new EmailFunctions();
