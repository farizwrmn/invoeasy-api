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
exports.updateInvoiceAction = exports.getInvoiceByIDAction = exports.createInvoiceAction = void 0;
const httpException_1 = require("../exceptions/httpException");
const invoice_query_1 = require("../queries/invoice.query");
const createInvoiceAction = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoice = yield (0, invoice_query_1.createInvoiceQuery)(data, data.userId);
        return invoice;
    }
    catch (err) {
        throw err;
    }
});
exports.createInvoiceAction = createInvoiceAction;
const getInvoiceByIDAction = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoice = yield (0, invoice_query_1.getInvoiceByIDQuery)(id);
        if (!invoice)
            throw new httpException_1.HttpException(404, 'Data not found');
        return invoice;
    }
    catch (err) {
        throw err;
    }
});
exports.getInvoiceByIDAction = getInvoiceByIDAction;
const updateInvoiceAction = (id, invoiceData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoice = yield (0, invoice_query_1.updateInvoiceQuery)(id, invoiceData);
        return invoice;
    }
    catch (err) {
        throw err;
    }
});
exports.updateInvoiceAction = updateInvoiceAction;
