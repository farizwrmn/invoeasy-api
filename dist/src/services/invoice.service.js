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
exports.calculateDueDate = exports.createRecurringInvoice = void 0;
exports.calculateNextInvoiceDate = calculateNextInvoiceDate;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createRecurringInvoice = (invoice) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newInvoice = yield prisma.invoice.create({
            data: {
                userId: invoice.userId,
                customerId: invoice.customerId,
                invoiceDate: new Date(),
                dueDate: (0, exports.calculateDueDate)(new Date()),
                status: 'Pending',
                products: {
                    create: invoice.products.map((product) => ({
                        itemId: product.itemId,
                        productId: product.productId,
                        quantity: product.quantity,
                        price: product.price,
                    })),
                },
                termsCondition: invoice.termsCondition,
                tax: invoice.tax,
                totalPrice: invoice.totalPrice,
            },
            include: {
                products: true,
            },
        });
        return newInvoice;
    }
    catch (error) {
        console.error('Error creating recurring invoice:', error);
        throw new Error('Failed to create recurring invoice');
    }
});
exports.createRecurringInvoice = createRecurringInvoice;
const calculateDueDate = (startDate, days = 30) => {
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + days);
    return dueDate;
};
exports.calculateDueDate = calculateDueDate;
function calculateNextInvoiceDate(invoice) {
    const nextInvoiceDate = new Date(invoice.nextInvoiceDate);
    if (invoice.recurrenceType === 'weekly') {
        nextInvoiceDate.setDate(nextInvoiceDate.getDate() + 7);
    }
    else if (invoice.recurrenceType === 'monthly') {
        nextInvoiceDate.setMonth(nextInvoiceDate.getMonth() + 1);
    }
    return nextInvoiceDate;
}
