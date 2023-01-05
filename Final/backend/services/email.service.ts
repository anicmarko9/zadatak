import * as pug from "pug";
import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { htmlToText } from "html-to-text";
import User from "./../models/userPG.model";
import { Email } from "../types/user.type";

export const sendEmail = async (
  user: User,
  url: string,
  type: string
): Promise<void> => {
  const email: Email = {
    to: user.email,
    firstName: user.name.split(" ")[0],
    url: url,
    from: `Marko Anic <${process.env.EMAIL_FROM}>`,
  };
  switch (type) {
    case "Welcome": {
      await sendWelcome(email);
      break;
    }
    case "PasswordReset": {
      await sendPasswordReset(email);
      break;
    }
    default:
      console.log("Not yet implemented!");
  }
};

const newTransport =
  (): nodemailer.Transporter<SMTPTransport.SentMessageInfo> => {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  };

// send email
const send = async (
  template: string,
  subject: string,
  email: Email
): Promise<void> => {
  // render HTML based on a PUG template
  const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
    firstName: email.firstName,
    url: email.url,
    subject,
  });
  // email options
  const mailOptions = {
    from: email.from,
    to: email.to,
    subject,
    html,
    text: htmlToText(html),
  };

  // create a transport and send email
  await newTransport().sendMail(mailOptions);
};

const sendWelcome = async (email: Email): Promise<void> => {
  await send("welcome", "Welcome to the Weather App", email);
};

const sendPasswordReset = async (email: Email): Promise<void> => {
  await send(
    "passwordReset",
    "Your password reset token (valid for only 10 minutes)",
    email
  );
};
