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
exports.createRecurringInvoiceController = exports.updateInvoiceRecurrenceController = exports.resendInvoiceController = exports.updateInvoiceController = exports.getInvoiceByIDController = exports.softDeleteInvoiceAction = exports.getInvoicesByUserIDController = exports.createInvoiceController = void 0;
const invoice_action_1 = require("../actions/invoice.action");
const nodemailer_1 = require("../helpers/nodemailer");
const pdfkit_1 = require("../helpers/pdfkit");
const invoice_query_1 = require("../queries/invoice.query");
const invoice_service_1 = require("../services/invoice.service");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createInvoiceController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const params = req.body;
        const customer = yield prisma.customer.findUnique({
            where: {
                id: params.customerId,
                name: params.customerName,
                address: params.address,
            },
        });
        const user = yield prisma.user.findUnique({
            where: {
                id: params.userId,
                name: params.name,
                email: params.email,
                phone: params.phone,
            },
        });
        const data = yield (0, invoice_action_1.createInvoiceAction)(Object.assign({}, params));
        const pdfPath = (0, pdfkit_1.generateInvoicePDF)(data, customer, user);
        const email = yield (0, nodemailer_1.sendInvoiceEmail)({
            to: (_a = customer === null || customer === void 0 ? void 0 : customer.customerEmail) !== null && _a !== void 0 ? _a : '',
            subject: 'Invoeasy',
            text: `${data.invoiceNumber}`,
            attachmentPath: pdfPath,
        });
        res.status(200).json({
            message: 'Create Invoice success',
            data,
            email,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createInvoiceController = createInvoiceController;
const getInvoicesByUserIDController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword = '', page = 1, size = 5, startDate, endDate, status, } = req.query;
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }
        const dateFilter = {};
        if (startDate && endDate && startDate === endDate) {
            const exactDate = new Date(startDate);
            dateFilter.gte = exactDate;
            dateFilter.lte = new Date(exactDate.getTime() + 24 * 60 * 60 * 1000);
        }
        else {
            if (startDate) {
                dateFilter.gte = new Date(startDate);
            }
            if (endDate) {
                dateFilter.lte = new Date(endDate);
            }
        }
        const invoices = yield prisma.invoice.findMany({
            where: {
                userId: userId,
                deletedAt: null,
                invoiceNumber: {
                    contains: keyword,
                },
                invoiceDate: dateFilter,
                status: status ? status : undefined,
            },
            orderBy: {
                invoiceDate: 'asc',
            },
            skip: Number(page) > 0 ? (Number(page) - 1) * Number(size) : 0,
            take: Number(size),
        });
        const data = yield prisma.invoice.aggregate({
            _count: {
                id: true,
            },
            where: {
                userId: userId,
                deletedAt: null,
                invoiceNumber: {
                    contains: keyword,
                },
                invoiceDate: dateFilter,
                status: status ? status : undefined,
            },
        });
        const count = data._count.id;
        const pages = Math.ceil(count / Number(size));
        if (invoices.length === 0) {
            res.status(404).json({ message: 'No invoices found for this user' });
            return;
        }
        res.status(200).json({ invoices, pages, size: Number(size), count });
    }
    catch (err) {
        next(err);
    }
});
exports.getInvoicesByUserIDController = getInvoicesByUserIDController;
const softDeleteInvoiceAction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedInvoice = yield (0, invoice_query_1.softDeleteInvoice)(id);
        res.status(200).json({
            message: 'Invoice soft deleted successfully',
            data: deletedInvoice,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to soft delete Invoice' });
    }
});
exports.softDeleteInvoiceAction = softDeleteInvoiceAction;
const getInvoiceByIDController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = yield (0, invoice_action_1.getInvoiceByIDAction)(id);
        res.status(200).json({
            message: 'Get invoice success',
            data,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getInvoiceByIDController = getInvoiceByIDController;
const updateInvoiceController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const params = req.body;
        const data = yield (0, invoice_action_1.updateInvoiceAction)(id, Object.assign(Object.assign({}, params), { status: params.status ? params.status : 'pending' }));
        res.status(200).json({
            message: 'Update invoice success',
            data,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateInvoiceController = updateInvoiceController;
const resendInvoiceController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { invoiceId } = req.params;
        const invoice = yield prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: {
                customer: true,
                products: true,
                user: true,
            },
        });
        if (!invoice) {
            res.status(404).json({ message: 'Invoice not found' });
            return;
        }
        const pdfPath = (0, pdfkit_1.generateInvoicePDF)(invoice, invoice.customer, invoice.user);
        const email = yield (0, nodemailer_1.sendInvoiceEmail)({
            to: (_b = (_a = invoice.customer) === null || _a === void 0 ? void 0 : _a.customerEmail) !== null && _b !== void 0 ? _b : '',
            subject: 'Resent Invoice - Invoeasy',
            text: `Please find attached the invoice ${invoice.invoiceNumber}`,
            attachmentPath: pdfPath,
        });
        res.status(200).json({
            message: 'Invoice resent successfully',
            data: invoice,
            email,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.resendInvoiceController = resendInvoiceController;
const updateInvoiceRecurrenceController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { invoiceId, recurrence } = req.body;
        let nextInvoiceDate = new Date();
        if (recurrence === 'weekly') {
            nextInvoiceDate.setDate(nextInvoiceDate.getDate() + 7);
        }
        else if (recurrence === 'monthly') {
            nextInvoiceDate.setMonth(nextInvoiceDate.getMonth() + 1);
        }
        else if (recurrence === 'yearly') {
            nextInvoiceDate.setFullYear(nextInvoiceDate.getFullYear() + 1);
        }
        const invoice = yield prisma.invoice.update({
            where: { id: invoiceId },
            data: {
                recurrenceType: recurrence !== 'none' ? recurrence : null,
                nextInvoiceDate: nextInvoiceDate,
            },
        });
        res.status(200).json({ message: 'Recurrence updated', invoice });
    }
    catch (error) {
        next(error);
    }
});
exports.updateInvoiceRecurrenceController = updateInvoiceRecurrenceController;
const createRecurringInvoiceController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { invoiceId } = req.body;
        const invoice = yield prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: { products: true },
        });
        if (!invoice) {
            res.status(404).json({ message: 'Invoice not found' });
            return;
        }
        const newInvoice = yield prisma.invoice.create({
            data: {
                userId: invoice.userId,
                customerId: invoice.customerId,
                invoiceDate: new Date(),
                dueDate: (0, invoice_service_1.calculateDueDate)(new Date()),
                status: 'Pending',
                products: {
                    create: invoice.products.map((product) => ({
                        id: product.id,
                        itemId: product.itemId,
                        quantity: product.quantity,
                        price: product.price,
                    })),
                },
                recurrenceType: invoice.recurrenceType,
                nextInvoiceDate: (0, invoice_service_1.calculateNextInvoiceDate)(invoice),
                termsCondition: invoice.termsCondition,
                tax: invoice.tax,
                totalPrice: invoice.totalPrice,
            },
            include: { products: true },
        });
        res.status(201).json({ message: 'Recurring invoice created', newInvoice });
    }
    catch (error) {
        next(error);
    }
});
exports.createRecurringInvoiceController = createRecurringInvoiceController;
