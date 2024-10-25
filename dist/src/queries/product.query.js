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
exports.softDeleteProduct = exports.createProductQuery = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createProductQuery = (productData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trx = yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const product = yield prisma.item.create({
                    data: Object.assign(Object.assign({}, productData), { userId: userId }),
                });
                return product;
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
exports.createProductQuery = createProductQuery;
const softDeleteProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield prisma.item.update({
            where: {
                id: productId,
            },
            data: {
                deletedAt: new Date(),
            },
        });
        return product;
    }
    catch (err) {
        throw err;
    }
});
exports.softDeleteProduct = softDeleteProduct;
