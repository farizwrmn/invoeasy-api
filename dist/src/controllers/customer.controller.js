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
exports.updateCustomerController = exports.getCustomerByIDController = exports.getCustomersByUserIDController = exports.createCustomerController = exports.softDeleteCustomerAction = void 0;
const customer_action_1 = require("../actions/customer.action");
const customer_query_1 = require("../queries/customer.query");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createCustomerController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.body;
        const data = yield (0, customer_action_1.createCustomerAction)(Object.assign({}, params));
        res.status(200).json({
            message: 'Create Customer success',
            data,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createCustomerController = createCustomerController;
const getCustomersByUserIDController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword = '', page = 1, size = 5, type = '', paymentMethod = '', } = req.query;
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
        }
        const customers = yield prisma.customer.findMany({
            where: {
                userId: userId,
                deletedAt: null,
                OR: [
                    {
                        name: {
                            contains: keyword,
                        },
                    },
                    {
                        customerEmail: {
                            contains: keyword,
                        },
                    },
                ],
                type: type ? type : undefined,
                paymentMethod: paymentMethod ? paymentMethod : undefined,
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
                userId: userId,
                deletedAt: null,
                OR: [
                    {
                        name: {
                            contains: keyword,
                        },
                    },
                    {
                        customerEmail: {
                            contains: keyword,
                        },
                    },
                ],
                type: type ? type : undefined,
                paymentMethod: paymentMethod ? paymentMethod : undefined,
            },
        });
        const count = data._count.id;
        const pages = Math.ceil(count / Number(size));
        if (customers.length === 0) {
            res.status(404).json({ message: 'No customers found for this user' });
        }
        res.status(200).json({ customers, pages, size: Number(size), count });
    }
    catch (err) {
        next(err);
    }
});
exports.getCustomersByUserIDController = getCustomersByUserIDController;
const softDeleteCustomerAction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedCustomer = yield (0, customer_query_1.softDeleteCustomer)(id);
        res.status(200).json({
            message: 'Customer soft deleted successfully',
            data: deletedCustomer,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to soft delete customer' });
    }
});
exports.softDeleteCustomerAction = softDeleteCustomerAction;
const getCustomerByIDController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.params;
    try {
        const customer = yield prisma.customer.findUnique({
            where: { id: customerId },
        });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer);
    }
    catch (err) {
        console.error('Error fetching customer by ID:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getCustomerByIDController = getCustomerByIDController;
const updateCustomerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.params;
    const { name, customerEmail, address, type, paymentMethod } = req.body;
    try {
        const existingCustomer = yield prisma.customer.findUnique({
            where: { id: customerId },
        });
        if (!existingCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        const updatedCustomer = yield prisma.customer.update({
            where: { id: customerId },
            data: {
                name,
                customerEmail,
                address,
                type,
                paymentMethod,
            },
        });
        res.status(200).json(updatedCustomer);
    }
    catch (err) {
        console.error('Error updating customer:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateCustomerController = updateCustomerController;
