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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduledInvoice = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const invoice_service_1 = require("../services/invoice.service");
const nodemailer_1 = require("../helpers/nodemailer");
const pdfkit_1 = require("../helpers/pdfkit");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const scheduledInvoice = () => {
    node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        console.log('Scheduler triggered at:', new Date());
        try {
            const now = new Date();
            yield prisma.invoice.updateMany({
                where: {
                    status: 'Pending',
                    dueDate: {
                        lt: now,
                    },
                },
                data: {
                    status: 'Expired',
                },
            });
            const recurringInvoices = yield prisma.invoice.findMany({
                where: {
                    nextInvoiceDate: {
                        lte: now,
                    },
                    recurrenceType: {
                        not: null,
                    },
                },
                include: {
                    customer: true,
                    products: true,
                    user: true,
                },
            });
            for (const invoice of recurringInvoices) {
                const newInvoice = yield (0, invoice_service_1.createRecurringInvoice)(invoice);
                yield (0, nodemailer_1.sendInvoiceEmail)({
                    to: (_b = (_a = invoice.customer) === null || _a === void 0 ? void 0 : _a.customerEmail) !== null && _b !== void 0 ? _b : '',
                    subject: `Invoice ${invoice.invoiceNumber} - Invoeasy`,
                    text: `Please find attached the invoice ${invoice.invoiceNumber}`,
                    attachmentPath: (0, pdfkit_1.generateInvoicePDF)(invoice, invoice.customer, invoice.user),
                });
                let nextInvoiceDate = new Date((_c = invoice.nextInvoiceDate) !== null && _c !== void 0 ? _c : now);
                if (invoice.recurrenceType === 'weekly') {
                    nextInvoiceDate.setDate(nextInvoiceDate.getDate() + 7);
                }
                else if (invoice.recurrenceType === 'monthly') {
                    nextInvoiceDate.setMonth(nextInvoiceDate.getMonth() + 1);
                }
                else if (invoice.recurrenceType === 'yearly') {
                    nextInvoiceDate.setFullYear(nextInvoiceDate.getFullYear() + 1);
                }
                yield prisma.invoice.update({
                    where: { id: invoice.id },
                    data: { nextInvoiceDate: nextInvoiceDate },
                });
            }
            console.log('Processing recurring invoices...');
        }
        catch (error) {
            console.error('Error processing recurring invoices:', error);
            console.error('Error during cron job:', error);
        }
    }));
};
exports.scheduledInvoice = scheduledInvoice;
