import type { Application } from 'express';
import authRouter from './auth.route';
import userRouter from './user.route';
import customerRouter from './customer.route';
import productRouter from './product.route';
import invoiceRouter from './invoice.route';

module.exports = (app: Application) => {
  app.use('/auth', authRouter);
  app.use('/users', userRouter);
  app.use('/customers', customerRouter);
  app.use('/products', productRouter);
  app.use('/invoices', invoiceRouter);
};
