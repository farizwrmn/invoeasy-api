import { config } from 'dotenv';
import { resolve } from 'path';

export const NODE_ENV = process.env.NODE_ENV || 'development';

const envFile = NODE_ENV === 'development' ? '.env.development' : '.env';

config({ path: resolve(__dirname, `../${envFile}`) });
config({ path: resolve(__dirname, `../${envFile}.local`), override: true });

export const PORT = process.env.PORT || 8000;
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL || '';
export const NODEMAILER_PASS = process.env.NODEMAILER_PASS || '';
export const JWT_SECRET = process.env.JWT_SECRET || '';
