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
exports.forgotPasswordQuery = exports.verifyQuery = exports.loginQuery = exports.registerQuery = void 0;
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const jsonwebtoken_1 = require("jsonwebtoken");
const index_1 = require("../config/index");
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const nodemailer_1 = require("../helpers/nodemailer");
const prisma = new client_1.PrismaClient();
const registerQuery = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const t = yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const user = yield prisma.user.create({
                    data: {
                        email: data.email,
                    },
                });
                const templatePath = path_1.default.join(__dirname, '../templates', 'registrationEmail.hbs');
                const payload = {
                    userId: user.id,
                    email: user.email,
                };
                const token = (0, jsonwebtoken_1.sign)(payload, String(index_1.API_KEY), { expiresIn: '1h' });
                const urlVerify = `${process.env.FRONTEND_URL}/verify?token=${token}`;
                const templateSource = fs_1.default.readFileSync(templatePath, 'utf-8');
                const compiledTemplate = handlebars_1.default.compile(templateSource);
                const html = compiledTemplate({
                    email: user.email,
                    url: urlVerify,
                });
                yield nodemailer_1.transporter.sendMail({
                    from: 'sender address',
                    to: user.email || '',
                    subject: 'Welcome to Invoeasy!',
                    html,
                });
                return user;
            }
            catch (err) {
                throw err;
            }
        }));
        return t;
    }
    catch (err) {
        throw err;
    }
});
exports.registerQuery = registerQuery;
const loginQuery = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            select: {
                id: true,
                email: true,
            },
            where: { email: data.email, password: data.password },
        });
        return user;
    }
    catch (err) {
        throw err;
    }
});
exports.loginQuery = loginQuery;
const verifyQuery = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield prisma.user.update({
                    data: {
                        password: data.password,
                    },
                    where: { email: data.email },
                });
            }
            catch (err) {
                throw err;
            }
        }));
    }
    catch (err) {
        throw err;
    }
});
exports.verifyQuery = verifyQuery;
const forgotPasswordQuery = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const t = yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const user = yield prisma.user.findUnique({
                    where: { email: email },
                });
                if (!user)
                    throw new Error('User does not exist');
                const templatePath = path_1.default.join(__dirname, '../templates', 'resetPasswordEmail.hbs');
                const payload = {
                    userId: user.id,
                    email: user.email,
                };
                const token = (0, jsonwebtoken_1.sign)(payload, String(index_1.API_KEY), { expiresIn: '1h' });
                const urlReset = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
                const templateSource = fs_1.default.readFileSync(templatePath, 'utf-8');
                const compiledTemplate = handlebars_1.default.compile(templateSource);
                const html = compiledTemplate({
                    email: user.email,
                    url: urlReset,
                });
                yield nodemailer_1.transporter.sendMail({
                    from: 'sender address',
                    to: user.email || '',
                    subject: 'Reset Password',
                    html,
                });
                return user;
            }
            catch (err) {
                throw err;
            }
        }));
        return t;
    }
    catch (err) {
        throw err;
    }
});
exports.forgotPasswordQuery = forgotPasswordQuery;
