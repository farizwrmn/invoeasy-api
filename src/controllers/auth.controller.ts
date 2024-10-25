import { Request, Response, NextFunction } from 'express';
import {
  forgotPasswordAction,
  loginAction,
  refreshTokenAction,
  registerAction,
  verifyAction,
} from '@/actions/auth.action';

const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await registerAction(req.body);

    res.status(200).json({
      message:
        'Register success, please verify your account trough your email first before Sign in.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await loginAction(req.body);

    res.status(200).json({
      message: 'Login Success',
      data,
    });
  } catch (err) {
    next(err);
  }
};

const verifyController = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = req.user?.email as string;
    const password = req.body.password;

    await verifyAction({
      email,
      password,
    });

    res.status(200).json({
      message: 'Verify success',
    });
  } catch (error) {
    console.log(error);
  }
};

const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const email = req.user?.email as string;

    const result = await refreshTokenAction(email);

    res.status(200).json({
      message: 'Refresh token success',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const email = req.body.email as string;

    const result = await forgotPasswordAction(email);

    res.status(200).json({
      message: 'Send reset password success',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const email = req.user?.email as string;
    const password = req.body.password;

    await verifyAction({
      email,
      password,
    });

    res.status(200).json({
      message: 'Reset password success',
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  registerController,
  loginController,
  verifyController,
  refreshTokenController,
  forgotPasswordController,
  resetPasswordController,
};
