import {
  createInvoiceAction,
  getInvoiceByIDAction,
  updateInvoiceAction,
} from '@/actions/invoice.action';
import { sendInvoiceEmail } from '@/helpers/nodemailer';
import { generateInvoicePDF } from '@/helpers/pdfkit';
import { IFilterInvoice } from '@/interfaces/invoice.interface';
import { softDeleteInvoice } from '@/queries/invoice.query';
import {
  calculateDueDate,
  calculateNextInvoiceDate,
} from '@/services/invoice.service';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

const createInvoiceController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = req.body;

    const customer = await prisma.customer.findUnique({
      where: {
        id: params.customerId,
        name: params.customerName,
        address: params.address,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: params.userId,
        name: params.name,
        email: params.email,
        phone: params.phone,
      },
    });

    const data = await createInvoiceAction({
      ...params,
    });

    const pdfPath = generateInvoicePDF(data, customer, user);
    const email = await sendInvoiceEmail({
      to: customer?.customerEmail ?? '',
      subject: 'Invoeasy',
      text: `${data.invoiceNumber}`,
      attachmentPath: pdfPath,
    });

    res.status(200).json({
      message: 'Create Invoice success',
      data,
      email,
    });
  } catch (err) {
    next(err);
  }
};

const getInvoicesByUserIDController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      keyword = '',
      page = 1,
      size = 5,
      startDate,
      endDate,
      status,
    } = req.query as IFilterInvoice;

    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }

    const dateFilter: any = {};
    if (startDate && endDate && startDate === endDate) {
      const exactDate = new Date(startDate as string);
      dateFilter.gte = exactDate;
      dateFilter.lte = new Date(exactDate.getTime() + 24 * 60 * 60 * 1000);
    } else {
      if (startDate) {
        dateFilter.gte = new Date(startDate as string);
      }
      if (endDate) {
        dateFilter.lte = new Date(endDate as string);
      }
    }
    const invoices = await prisma.invoice.findMany({
      where: {
        userId: userId,
        deletedAt: null,
        invoiceNumber: {
          contains: keyword,
        },
        invoiceDate: dateFilter,
        status: status ? status : undefined,
      },
      orderBy: {
        invoiceDate: 'asc',
      },
      skip: Number(page) > 0 ? (Number(page) - 1) * Number(size) : 0,
      take: Number(size),
    });

    const data = await prisma.invoice.aggregate({
      _count: {
        id: true,
      },
      where: {
        userId: userId,
        deletedAt: null,
        invoiceNumber: {
          contains: keyword,
        },
        invoiceDate: dateFilter,
        status: status ? status : undefined,
      },
    });

    const count = data._count.id;
    const pages = Math.ceil(count / Number(size));

    if (invoices.length === 0) {
      res.status(404).json({ message: 'No invoices found for this user' });
      return;
    }

    res.status(200).json({ invoices, pages, size: Number(size), count });
  } catch (err) {
    next(err);
  }
};

const softDeleteInvoiceAction = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedInvoice = await softDeleteInvoice(id);
    res.status(200).json({
      message: 'Invoice soft deleted successfully',
      data: deletedInvoice,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to soft delete Invoice' });
  }
};

const getInvoiceByIDController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await getInvoiceByIDAction(id);

    res.status(200).json({
      message: 'Get invoice success',
      data,
    });
  } catch (err) {
    next(err);
  }
};

const updateInvoiceController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const params = req.body;

    const data = await updateInvoiceAction(id, {
      ...params,
      status: params.status ? params.status : 'pending',
    });

    res.status(200).json({
      message: 'Update invoice success',
      data,
    });
  } catch (err) {
    next(err);
  }
};

const resendInvoiceController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { invoiceId } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
        products: true,
        user: true,
      },
    });

    if (!invoice) {
      res.status(404).json({ message: 'Invoice not found' });
      return;
    }

    const pdfPath = generateInvoicePDF(invoice, invoice.customer, invoice.user);

    const email = await sendInvoiceEmail({
      to: invoice.customer?.customerEmail ?? '',
      subject: 'Resent Invoice - Invoeasy',
      text: `Please find attached the invoice ${invoice.invoiceNumber}`,
      attachmentPath: pdfPath,
    });

    res.status(200).json({
      message: 'Invoice resent successfully',
      data: invoice,
      email,
    });
  } catch (err) {
    next(err);
  }
};

const updateInvoiceRecurrenceController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { invoiceId, recurrence } = req.body;

    let nextInvoiceDate = new Date();
    if (recurrence === 'weekly') {
      nextInvoiceDate.setDate(nextInvoiceDate.getDate() + 7);
    } else if (recurrence === 'monthly') {
      nextInvoiceDate.setMonth(nextInvoiceDate.getMonth() + 1);
    } else if (recurrence === 'yearly') {
      nextInvoiceDate.setFullYear(nextInvoiceDate.getFullYear() + 1);
    }

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        recurrenceType: recurrence !== 'none' ? recurrence : null,
        nextInvoiceDate: nextInvoiceDate,
      },
    });

    res.status(200).json({ message: 'Recurrence updated', invoice });
  } catch (error) {
    next(error);
  }
};

const createRecurringInvoiceController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { invoiceId } = req.body;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { products: true },
    });

    if (!invoice) {
      res.status(404).json({ message: 'Invoice not found' });
      return;
    }

    const newInvoice = await prisma.invoice.create({
      data: {
        userId: invoice.userId,
        customerId: invoice.customerId,
        invoiceDate: new Date(),
        dueDate: calculateDueDate(new Date()),
        status: 'Pending',
        products: {
          create: invoice.products.map((product) => ({
            id: product.id,
            itemId: product.itemId,
            quantity: product.quantity,
            price: product.price,
          })),
        },
        recurrenceType: invoice.recurrenceType,
        nextInvoiceDate: calculateNextInvoiceDate(invoice),
        termsCondition: invoice.termsCondition,
        tax: invoice.tax,
        totalPrice: invoice.totalPrice,
      },
      include: { products: true },
    });

    res.status(201).json({ message: 'Recurring invoice created', newInvoice });
  } catch (error) {
    next(error);
  }
};

export {
  createInvoiceController,
  getInvoicesByUserIDController,
  softDeleteInvoiceAction,
  getInvoiceByIDController,
  updateInvoiceController,
  resendInvoiceController,
  updateInvoiceRecurrenceController,
  createRecurringInvoiceController,
};
