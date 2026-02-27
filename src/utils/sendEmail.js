import nodemailer from 'nodemailer';
import env from './env.js';

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: env('SMTP_HOST'),
    port: Number(env('SMTP_PORT')),
    auth: {
      user: env('SMTP_USER'),
      pass: env('SMTP_PASSWORD'),
    },
  });

  const info = await transporter.sendMail({
    from: env('SMTP_FROM'),
    to,
    subject,
    html,
  });

  return info;
};