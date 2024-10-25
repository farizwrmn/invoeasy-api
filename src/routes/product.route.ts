import {
  createProductController,
  getProductByIDController,
  getProductsByUserIDController,
  softDeleteProductAction,
  updateProductController,
} from '@/controllers/product.controller';
import { verifyToken } from '@/middlewares/auth.middleware';
import express from 'express';

const router = express.Router();

router.post('/', verifyToken, createProductController);
router.get('/:userId', getProductsByUserIDController);
router.delete('/:id/soft-delete', softDeleteProductAction);
router.get('/product/:id', getProductByIDController);
router.put('/product/:id', updateProductController);

export default router;
