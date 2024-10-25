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
exports.updateProductController = exports.getProductByIDController = exports.getProductsByUserIDController = exports.createProductController = exports.softDeleteProductAction = void 0;
const product_action_1 = require("../actions/product.action");
const product_query_1 = require("../queries/product.query");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.body;
        const data = yield (0, product_action_1.createProductAction)(Object.assign({}, params));
        res.status(200).json({
            message: 'Create Product success',
            data,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createProductController = createProductController;
const getProductsByUserIDController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword = '', page = 1, size = 10, type = '', } = req.query;
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
        }
        const products = yield prisma.item.findMany({
            where: {
                userId: userId,
                deletedAt: null,
                name: {
                    contains: keyword,
                },
                type: type ? type : undefined,
            },
            orderBy: {
                name: 'asc',
            },
            skip: Number(page) > 0 ? (Number(page) - 1) * Number(size) : 0,
            take: Number(size),
        });
        const data = yield prisma.item.aggregate({
            _count: {
                id: true,
            },
            where: {
                userId: userId,
                deletedAt: null,
                name: {
                    contains: keyword,
                },
                type: type ? type : undefined,
            },
        });
        const count = data._count.id;
        const pages = Math.ceil(count / Number(size));
        if (products.length === 0) {
            res.status(404).json({ message: 'No products found for this user' });
        }
        res.status(200).json({ products, pages, size: Number(size), count });
    }
    catch (err) {
        next(err);
    }
});
exports.getProductsByUserIDController = getProductsByUserIDController;
const softDeleteProductAction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedProduct = yield (0, product_query_1.softDeleteProduct)(id);
        res.status(200).json({
            message: 'Product soft deleted successfully',
            data: deletedProduct,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to soft delete Product' });
    }
});
exports.softDeleteProductAction = softDeleteProductAction;
const getProductByIDController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield prisma.item.findUnique({
            where: { id: id },
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});
exports.getProductByIDController = getProductByIDController;
const updateProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, price, type } = req.body;
    try {
        const updatedProduct = yield prisma.item.update({
            where: { id: id },
            data: {
                name,
                price: parseFloat(price),
                type,
            },
        });
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});
exports.updateProductController = updateProductController;
