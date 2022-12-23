import * as pug from "pug";
import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { htmlToText } from "html-to-text";
import { HydratedDocument } from "mongoose";
import { IUser } from "../types/user.type";

export default class Email {
  to: string;
  firstName: string;
  url: string;
  from: string;
  constructor(user: HydratedDocument<IUser>, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Marko Anic <${process.env.EMAIL_FROM}>`;
  }

  newTransport(): nodemailer.Transporter<SMTPTransport.SentMessageInfo> {
    // only for development
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // send email
  async send(template: string, subject: string): Promise<void> {
    // render HTML based on a PUG template
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      firstName: this["firstName"],
      url: this["url"],
      subject,
    });

    // email options
    const mailOptions = {
      from: this["from"],
      to: this["to"],
      subject,
      html,
      text: htmlToText(html),
    };

    // create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome(): Promise<void> {
    await this.send("welcome", "Welcome to the Weather App");
  }

  async sendPasswordReset(): Promise<void> {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
}
