import nodemailer from "nodemailer";
import { Service } from "typedi";

@Service()
export default class EmailService {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your Gmail
      pass: process.env.EMAIL_PASS, // app-specific password
    },
  });

  public async sendOtpEmail(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Smart Note App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Password Reset OTP",
      html: `<p>Hello,</p>
             <p>Your OTP for password reset is: <b>${otp}</b></p>
             <p>This OTP will expire in 10 minutes.</p>`,
    });
  }
}
