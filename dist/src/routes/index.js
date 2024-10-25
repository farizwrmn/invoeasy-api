"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_route_1 = __importDefault(require("./auth.route"));
const user_route_1 = __importDefault(require("./user.route"));
const customer_route_1 = __importDefault(require("./customer.route"));
const product_route_1 = __importDefault(require("./product.route"));
const invoice_route_1 = __importDefault(require("./invoice.route"));
module.exports = (app) => {
    app.use('/auth', auth_route_1.default);
    app.use('/users', user_route_1.default);
    app.use('/customers', customer_route_1.default);
    app.use('/products', product_route_1.default);
    app.use('/invoices', invoice_route_1.default);
};
