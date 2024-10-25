"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customer_controller_1 = require("../controllers/customer.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/', auth_middleware_1.verifyToken, customer_controller_1.createCustomerController);
router.get('/:userId', customer_controller_1.getCustomersByUserIDController);
router.delete('/:id/soft-delete', customer_controller_1.softDeleteCustomerAction);
router.get('/customer/:customerId', customer_controller_1.getCustomerByIDController);
router.put('/:customerId', customer_controller_1.updateCustomerController);
exports.default = router;
