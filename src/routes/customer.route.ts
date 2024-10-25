import {
  createCustomerController,
  getCustomerByIDController,
  getCustomersByUserIDController,
  softDeleteCustomerAction,
  updateCustomerController,
} from '@/controllers/customer.controller';
import { verifyToken } from '@/middlewares/auth.middleware';
import express from 'express';

const router = express.Router();

router.post('/', verifyToken, createCustomerController);
router.get('/:userId', getCustomersByUserIDController);
router.delete('/:id/soft-delete', softDeleteCustomerAction);
router.get('/customer/:customerId', getCustomerByIDController);
router.put('/:customerId', updateCustomerController);

export default router;
