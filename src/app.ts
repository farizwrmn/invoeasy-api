import express, { Application } from 'express';
import { API_PORT } from './config/index';
import path = require('path');
import cors from 'cors';
import { scheduledInvoice } from './cron/scheduledInvoice';
import { authMiddleware } from './middlewares/auth.middleware';

const PORT: number = Number(API_PORT) || 8000;
const app: Application = express();

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
require('./routes')(app);
app.use('/protected', authMiddleware, (req, res) => {
  res.send('This is a protected route.');
});

// scheduledInvoice();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
