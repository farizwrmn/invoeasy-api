import {
  getUserByIDController,
  getUsersController,
  updateUserController,
} from '@/controllers/user.controller';
import { verifyToken } from '@/middlewares/auth.middleware';
import express from 'express';

const router = express.Router();

router.get('/', getUsersController);
router.get('/:id', getUserByIDController);
router.patch('/:id', verifyToken, updateUserController);

export default router;
