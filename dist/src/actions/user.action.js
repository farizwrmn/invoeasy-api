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
exports.updateUserAction = exports.getUsersAction = exports.getUserByIDAction = void 0;
const httpException_1 = require("../exceptions/httpException");
const user_query_1 = require("../queries/user.query");
const getUsersAction = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, user_query_1.getUsersQuery)(filters);
        return users;
    }
    catch (err) {
        throw err;
    }
});
exports.getUsersAction = getUsersAction;
const getUserByIDAction = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_query_1.getUserByIDQuery)(id);
        if (!user)
            throw new httpException_1.HttpException(404, 'Data not found');
        return user;
    }
    catch (err) {
        throw err;
    }
});
exports.getUserByIDAction = getUserByIDAction;
const updateUserAction = (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_query_1.updateUserQuery)(id, userData);
        return user;
    }
    catch (err) {
        throw err;
    }
});
exports.updateUserAction = updateUserAction;
