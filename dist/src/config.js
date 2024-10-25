"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.NODEMAILER_PASS = exports.NODEMAILER_EMAIL = exports.DATABASE_URL = exports.PORT = exports.NODE_ENV = void 0;
const dotenv_1 = require("dotenv");
const path_1 = require("path");
exports.NODE_ENV = process.env.NODE_ENV || 'development';
const envFile = exports.NODE_ENV === 'development' ? '.env.development' : '.env';
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, `../${envFile}`) });
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, `../${envFile}.local`), override: true });
exports.PORT = process.env.PORT || 8000;
exports.DATABASE_URL = process.env.DATABASE_URL || '';
exports.NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL || '';
exports.NODEMAILER_PASS = process.env.NODEMAILER_PASS || '';
exports.JWT_SECRET = process.env.JWT_SECRET || '';
