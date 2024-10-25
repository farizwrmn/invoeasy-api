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
exports.updateInvoiceQuery = exports.getInvoiceByIDQuery = exports.softDeleteInvoice = exports.createInvoiceQuery = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createInvoiceQuery = (invoiceData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trx = yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const invoice = yield prisma.invoice.create({
                    data: Object.assign(Object.assign({}, invoiceData), { userId: userId, products: {
                            create: invoiceData.products.map((product) => ({
                                itemId: product.itemId,
                                quantity: product.quantity,
                                price: product.price,
                                name: product.name,
                            })),
                        } }),
                    include: {
                        products: true,
                    },
                });
                return invoice;
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
exports.createInvoiceQuery = createInvoiceQuery;
const softDeleteInvoice = (invoiceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoice = yield prisma.invoice.update({
            where: {
                id: invoiceId,
            },
            data: {
                deletedAt: new Date(),
            },
        });
        return invoice;
    }
    catch (err) {
        throw err;
    }
});
exports.softDeleteInvoice = softDeleteInvoice;
const getInvoiceByIDQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoice = yield prisma.invoice.findUnique({
            where: {
                id,
            },
        });
        return invoice;
    }
    catch (err) {
        throw err;
    }
});
exports.getInvoiceByIDQuery = getInvoiceByIDQuery;
const updateInvoiceQuery = (id, invoiceData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = yield prisma.invoice.update({
            data: Object.assign(Object.assign({}, invoiceData), { products: {} }),
            where: {
                id,
            },
        });
        return address;
    }
    catch (err) {
        throw err;
    }
});
exports.updateInvoiceQuery = updateInvoiceQuery;
