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
exports.forgotPasswordAction = exports.refreshTokenAction = exports.verifyAction = exports.loginAction = exports.registerAction = void 0;
const auth_query_1 = require("../queries/auth.query");
const user_query_1 = require("../queries/user.query");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const index_1 = require("../config/index");
const httpException_1 = require("../exceptions/httpException");
const registerAction = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const check = yield (0, user_query_1.getUserByEmailQuery)(data.email || '');
        if (check)
            throw new Error('User already exist');
        const user = yield (0, auth_query_1.registerQuery)(data);
        return user;
    }
    catch (err) {
        throw err;
    }
});
exports.registerAction = registerAction;
const loginAction = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_query_1.getUserByEmailQuery)(data.email);
        if (!user)
            throw new Error('email doesnt exist');
        const isValid = yield (0, bcrypt_1.compare)(data.password, user.password || '');
        if (!isValid)
            throw new Error('password is wrong');
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            birthDate: user.birthDate,
        };
        const token = (0, jsonwebtoken_1.sign)(payload, String(index_1.API_KEY), { expiresIn: '10h' });
        return { user, token };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
});
exports.loginAction = loginAction;
const verifyAction = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findUser = yield (0, user_query_1.getUserByEmailQuery)(data.email);
        if (!findUser)
            throw new Error('User does not exist');
        const salt = yield (0, bcrypt_1.genSalt)(10);
        const hashPass = yield (0, bcrypt_1.hash)(data.password || '', salt);
        yield (0, auth_query_1.verifyQuery)({
            email: data.email,
            password: hashPass,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.verifyAction = verifyAction;
const refreshTokenAction = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_query_1.getUserByEmailQuery)(email);
        if (!user)
            throw new httpException_1.HttpException(500, 'Something went wrong');
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            birthDate: user.birthDate,
        };
        const token = (0, jsonwebtoken_1.sign)(payload, String(index_1.API_KEY), { expiresIn: '1hr' });
        return { user, token };
    }
    catch (err) {
        throw err;
    }
});
exports.refreshTokenAction = refreshTokenAction;
const forgotPasswordAction = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findUser = yield (0, user_query_1.getUserByEmailQuery)(email);
        if (!findUser)
            throw new Error('User does not exist');
        const user = yield (0, auth_query_1.forgotPasswordQuery)(email);
        return user;
    }
    catch (err) {
        throw err;
    }
});
exports.forgotPasswordAction = forgotPasswordAction;
