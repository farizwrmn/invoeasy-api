"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const invoice_controller_1 = require("../controllers/invoice.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/', auth_middleware_1.verifyToken, invoice_controller_1.createInvoiceController);
router.get('/:userId', invoice_controller_1.getInvoicesByUserIDController);
router.delete('/:id/soft-delete', invoice_controller_1.softDeleteInvoiceAction);
router.get('/invoice/:id', auth_middleware_1.verifyToken, invoice_controller_1.getInvoiceByIDController);
router.patch('/invoice/:id', auth_middleware_1.verifyToken, invoice_controller_1.updateInvoiceController);
router.post('/:invoiceId/resend', invoice_controller_1.resendInvoiceController);
router.post('/update-recurrence', invoice_controller_1.updateInvoiceRecurrenceController);
router.post('/recurring', invoice_controller_1.createRecurringInvoiceController);
exports.default = router;
