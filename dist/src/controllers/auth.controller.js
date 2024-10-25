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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordController = exports.forgotPasswordController = exports.refreshTokenController = exports.verifyController = exports.loginController = exports.registerController = void 0;
const auth_action_1 = require("../actions/auth.action");
const registerController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, auth_action_1.registerAction)(req.body);
        res.status(200).json({
            message: 'Register success, please verify your account trough your email first before Sign in.',
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.registerController = registerController;
const loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, auth_action_1.loginAction)(req.body);
        res.status(200).json({
            message: 'Login Success',
            data,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.loginController = loginController;
const verifyController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        const password = req.body.password;
        yield (0, auth_action_1.verifyAction)({
            email,
            password,
        });
        res.status(200).json({
            message: 'Verify success',
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.verifyController = verifyController;
const refreshTokenController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        const result = yield (0, auth_action_1.refreshTokenAction)(email);
        res.status(200).json({
            message: 'Refresh token success',
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.refreshTokenController = refreshTokenController;
const forgotPasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const result = yield (0, auth_action_1.forgotPasswordAction)(email);
        res.status(200).json({
            message: 'Send reset password success',
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.forgotPasswordController = forgotPasswordController;
const resetPasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        const password = req.body.password;
        yield (0, auth_action_1.verifyAction)({
            email,
            password,
        });
        res.status(200).json({
            message: 'Reset password success',
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.resetPasswordController = resetPasswordController;
