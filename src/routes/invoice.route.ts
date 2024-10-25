import {
  createInvoiceController,
  createRecurringInvoiceController,
  getInvoiceByIDController,
  getInvoicesByUserIDController,
  resendInvoiceController,
  softDeleteInvoiceAction,
  updateInvoiceController,
  updateInvoiceRecurrenceController,
} from '@/controllers/invoice.controller';
import { verifyToken } from '@/middlewares/auth.middleware';
import express from 'express';

const router = express.Router();

router.post('/', verifyToken, createInvoiceController);
router.get('/:userId', getInvoicesByUserIDController);
router.delete('/:id/soft-delete', softDeleteInvoiceAction);
router.get('/invoice/:id', verifyToken, getInvoiceByIDController);
router.patch('/invoice/:id', verifyToken, updateInvoiceController);
router.post('/:invoiceId/resend', resendInvoiceController);
router.post('/update-recurrence', updateInvoiceRecurrenceController);
router.post('/recurring', createRecurringInvoiceController);

export default router;
