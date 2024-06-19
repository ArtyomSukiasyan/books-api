import nodemailer from "nodemailer";
import { Attachment } from "nodemailer/lib/mailer";

interface ISendEmail {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: Attachment[];
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_URL,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail(props: ISendEmail) {
  try {
    await transporter.sendMail(props);
    return true;
  } catch (err) {
    console.log(err);

    throw new Error();
  }
}

export default {
  sendMail,
};
