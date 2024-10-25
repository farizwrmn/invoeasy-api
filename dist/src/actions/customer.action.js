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
exports.getCustomersByUserIDAction = exports.getCustomersAction = exports.createCustomerAction = void 0;
const customer_query_1 = require("../queries/customer.query");
const createCustomerAction = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield (0, customer_query_1.createCustomerQuery)(data, data.userId);
        return customer;
    }
    catch (err) {
        throw err;
    }
});
exports.createCustomerAction = createCustomerAction;
const getCustomersAction = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, customer_query_1.getCustomersQuery)(id);
        return data;
    }
    catch (err) {
        throw err;
    }
});
exports.getCustomersAction = getCustomersAction;
const getCustomersByUserIDAction = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, customer_query_1.getCustomersByUserIDQuery)(filters);
        return products;
    }
    catch (err) {
        throw err;
    }
});
exports.getCustomersByUserIDAction = getCustomersByUserIDAction;
