"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODEMAILER_PASS = exports.NODEMAILER_EMAIL = exports.API_KEY = exports.API_PORT = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({
    path: '.env',
});
_a = process.env, exports.API_PORT = _a.API_PORT, exports.API_KEY = _a.API_KEY, exports.NODEMAILER_EMAIL = _a.NODEMAILER_EMAIL, exports.NODEMAILER_PASS = _a.NODEMAILER_PASS;
