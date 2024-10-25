"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInvoiceEmail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const config_2 = require("../config");
exports.transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: String(config_1.NODEMAILER_EMAIL),
        pass: String(config_2.NODEMAILER_PASS),
    },
});
dotenv_1.default.config();
const createTransporter = () => {
    return nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};
const sendInvoiceEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!options.to) {
        throw new Error('Recipient email address (to) is required.');
    }
    const transporter = createTransporter();
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        attachments: options.attachmentPath
            ? [
                {
                    filename: path_1.default.basename(options.attachmentPath),
                    path: options.attachmentPath,
                },
            ]
            : [],
    };
    try {
        yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Failed to send email: ${error}`);
    }
});
exports.sendInvoiceEmail = sendInvoiceEmail;
