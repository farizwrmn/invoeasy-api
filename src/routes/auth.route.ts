import {
  forgotPasswordController,
  loginController,
  refreshTokenController,
  registerController,
  resetPasswordController,
  verifyController,
} from '@/controllers/auth.controller';
import { verifyToken } from '@/middlewares/auth.middleware';
import express from 'express';

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/verify', verifyToken, verifyController);
router.get('/', verifyToken, refreshTokenController);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password', verifyToken, resetPasswordController);

export default router;
