import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { NODEMAILER_EMAIL } from '@/config';
import { NODEMAILER_PASS } from '@/config';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: String(NODEMAILER_EMAIL),
    pass: String(NODEMAILER_PASS),
  },
});

dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  attachmentPath?: string;
}

const createTransporter = (): Transporter => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendInvoiceEmail = async (
  options: EmailOptions,
): Promise<void> => {
  if (!options.to) {
    throw new Error('Recipient email address (to) is required.');
  }

  const transporter = createTransporter();

  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.SMTP_USER,
    to: options.to,
    subject: options.subject,
    text: options.text,
    attachments: options.attachmentPath
      ? [
          {
            filename: path.basename(options.attachmentPath),
            path: options.attachmentPath,
          },
        ]
      : [],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error}`);
  }
};
