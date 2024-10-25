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
exports.updateUserQuery = exports.getUserByIDQuery = exports.getUsersQuery = exports.getUserByEmailQuery = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUsersQuery = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword = '', page = 1, size = 1000 } = filters;
        const users = yield prisma.user.findMany({
            where: {
                OR: [
                    {
                        email: {
                            contains: keyword,
                        },
                    },
                ],
            },
            skip: Number(page) > 0 ? (Number(page) - 1) * Number(size) : 0,
            take: Number(size),
        });
        const data = yield prisma.user.aggregate({
            _count: {
                id: true,
            },
            where: {
                email: {
                    contains: keyword,
                },
            },
        });
        const count = data._count.id;
        const pages = Math.ceil(count / size);
        return { users, pages };
    }
    catch (err) {
        throw err;
    }
});
exports.getUsersQuery = getUsersQuery;
const getUserByEmailQuery = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: {
                email,
            },
        });
        return user;
    }
    catch (err) {
        throw err;
    }
});
exports.getUserByEmailQuery = getUserByEmailQuery;
const getUserByIDQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id,
            },
        });
        return user;
    }
    catch (err) {
        throw err;
    }
});
exports.getUserByIDQuery = getUserByIDQuery;
const updateUserQuery = (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.update({
            data: Object.assign({}, userData),
            where: {
                id,
            },
        });
        return user;
    }
    catch (err) {
        throw err;
    }
});
exports.updateUserQuery = updateUserQuery;
