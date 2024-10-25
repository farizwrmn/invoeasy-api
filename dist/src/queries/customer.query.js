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
exports.softDeleteCustomer = exports.createCustomerQuery = exports.getCustomersByUserIDQuery = exports.getCustomersQuery = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createCustomerQuery = (customerData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trx = yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const existCustomer = yield prisma.customer.findUnique({
                    where: {
                        customerEmail: customerData.customerEmail,
                    },
                });
                if (existCustomer)
                    throw new Error('Customer already exists');
                const customer = yield prisma.customer.create({
                    data: Object.assign(Object.assign({}, customerData), { userId: userId }),
                });
                return customer;
            }
            catch (err) {
                throw err;
            }
        }));
        return trx;
    }
    catch (err) {
        throw err;
    }
});
exports.createCustomerQuery = createCustomerQuery;
const getCustomersQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield prisma.customer.findMany({
            include: {
                user: true,
            },
            where: {
                id,
            },
        });
        return customers;
    }
    catch (err) {
        throw err;
    }
});
exports.getCustomersQuery = getCustomersQuery;
const getCustomersByUserIDQuery = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword = '', page = 1, size = 1000 } = filters;
        const customers = yield prisma.customer.findMany({
            where: {
                name: {
                    contains: keyword,
                },
                deletedAt: null,
            },
            orderBy: {
                name: 'asc',
            },
            skip: Number(page) > 0 ? (Number(page) - 1) * Number(size) : 0,
            take: Number(size),
        });
        const data = yield prisma.customer.aggregate({
            _count: {
                id: true,
            },
            where: {
                name: {
                    contains: keyword,
                },
            },
        });
        const count = data._count.id;
        const pages = Math.ceil(count / size);
        return { customers, pages };
    }
    catch (err) {
        throw err;
    }
});
exports.getCustomersByUserIDQuery = getCustomersByUserIDQuery;
const softDeleteCustomer = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield prisma.customer.update({
            where: {
                id: customerId,
            },
            data: {
                deletedAt: new Date(),
            },
        });
        return customer;
    }
    catch (err) {
        throw err;
    }
});
exports.softDeleteCustomer = softDeleteCustomer;
