import { RegisterAuth, Auth } from '@/interfaces/auth.interface';
import { PrismaClient, User } from '@prisma/client';
import path from 'path';
import { sign } from 'jsonwebtoken';
import { API_KEY } from '../config/index';
import fs from 'fs';
import handlebars from 'handlebars';
import { transporter } from '../helpers/nodemailer';

const prisma = new PrismaClient();

const registerQuery = async (data: RegisterAuth): Promise<User> => {
  try {
    const t = await prisma.$transaction(async (prisma) => {
      try {
        const user = await prisma.user.create({
          data: {
            email: data.email,
          },
        });

        const templatePath = path.join(
          __dirname,
          '../templates',
          'registrationEmail.hbs',
        );
        const payload = {
          userId: user.id,
          email: user.email,
        };
        const token = sign(payload, String(API_KEY), { expiresIn: '1h' });
        const urlVerify = `${process.env.FRONTEND_URL}/verify?token=${token}`;
        const templateSource = fs.readFileSync(templatePath, 'utf-8');

        const compiledTemplate = handlebars.compile(templateSource);
        const html = compiledTemplate({
          email: user.email,
          url: urlVerify,
        });

        await transporter.sendMail({
          from: 'sender address',
          to: user.email || '',
          subject: 'Welcome to Invoeasy!',
          html,
        });

        return user;
      } catch (err) {
        throw err;
      }
    });
    return t;
  } catch (err) {
    throw err;
  }
};

const loginQuery = async (data: Auth) => {
  try {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        email: true,
      },
      where: { email: data.email, password: data.password },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

const verifyQuery = async (data: Auth) => {
  try {
    await prisma.$transaction(async (prisma) => {
      try {
        await prisma.user.update({
          data: {
            password: data.password,
          },
          where: { email: data.email },
        });
      } catch (err) {
        throw err;
      }
    });
  } catch (err) {
    throw err;
  }
};

const forgotPasswordQuery = async (email: string): Promise<User> => {
  try {
    const t = await prisma.$transaction(async (prisma) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!user) throw new Error('User does not exist');

        const templatePath = path.join(
          __dirname,
          '../templates',
          'resetPasswordEmail.hbs',
        );
        const payload = {
          userId: user.id,
          email: user.email,
        };
        const token = sign(payload, String(API_KEY), { expiresIn: '1h' });
        const urlReset = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        const templateSource = fs.readFileSync(templatePath, 'utf-8');

        const compiledTemplate = handlebars.compile(templateSource);
        const html = compiledTemplate({
          email: user.email,
          url: urlReset,
        });

        await transporter.sendMail({
          from: 'sender address',
          to: user.email || '',
          subject: 'Reset Password',
          html,
        });

        return user;
      } catch (err) {
        throw err;
      }
    });
    return t;
  } catch (err) {
    throw err;
  }
};

export { registerQuery, loginQuery, verifyQuery, forgotPasswordQuery };
