import { transport } from "../config/configNodemailer";

type EmailType = {
  name: string;
  email: string;
  token: string;
};
export class AuthEmail {
  static sendConfirmationEmail = async (user: EmailType) => {
    const email = await transport.sendMail({
      from: "CrashTaker <admin@castracker.com>",
      to: user.email,
      subject: "Castracker - Confirm your account",
      html: `
            <p>Hi ${user.name},you have created your account in CashTracker</p>
            <p>Follow the next link to confirm your account</p>
            <a href="#">Confirm account</a>
            <p>Write token: <b>${user.token}</b></p>
                `,
    });
  };

  static sendTokenResetPassword = async (user: EmailType) => {
    const email = await transport.sendMail({
      from: "CrashTaker <admin@castracker.com>",
      to: user.email,
      subject: "CashTracker - Reset your password",
      html: `
            <p>Hi ${user.name}, you have requested reset your password on CashTracker</p>
            <p>Follow the next link to reset password/p>
            <a href="#">Reset passwordt</a>
            <p>Write token: <b>${user.token}</b></p>
                `,
    });
  };
}
