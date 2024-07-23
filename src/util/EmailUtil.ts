import nodemailer from "nodemailer";

export class EmailUtil {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(options: {
    from: string;
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
  }): Promise<void> {
    try {
      const info = await this.transporter.sendMail(options);
      console.log("Email sent:", info.response);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error; // Rethrow the error for handling in the calling code
    }
  }
}

export default EmailUtil;
