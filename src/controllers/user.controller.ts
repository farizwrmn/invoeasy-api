import {
  getUserByIDAction,
  getUsersAction,
  updateUserAction,
} from '@/actions/user.action';
import { Request, Response, NextFunction } from 'express';

const getUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const filters = req.query;

    const data = await getUsersAction(filters);

    res.status(200).json({
      message: 'Get users success',
      data,
    });
  } catch (err) {
    next(err);
  }
};

const getUserByIDController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await getUserByIDAction(id);

    res.status(200).json({
      message: 'Get user success',
      data,
    });
  } catch (err) {
    next(err);
  }
};

const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const params = req.body;

    const data = await updateUserAction(id, {
      ...params,
    });

    res.status(200).json({
      message: 'Update user success',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export { getUsersController, getUserByIDController, updateUserController };
