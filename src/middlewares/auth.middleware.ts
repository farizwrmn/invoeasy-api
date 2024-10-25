import { Response, NextFunction, Request } from 'express';
import { verify } from 'jsonwebtoken';
import { API_KEY } from '../config/index';
import { User } from '../types/express';
import jwt from 'jsonwebtoken';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) throw new Error('Token invalid');

    const verifyUser = verify(token, String(API_KEY));
    if (!verifyUser) throw new Error('unauthorized');

    req.user = verifyUser as User;

    next();
  } catch (err) {
    next(err);
  }
};

const SECRET_KEY = process.env.JWT_SECRET as string;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded as User;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export { verifyToken, authMiddleware };
