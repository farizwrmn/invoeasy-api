import { HttpException } from '@/exceptions/httpException';
import { IInvoice } from '@/interfaces/invoice.interface';
import {
  createInvoiceQuery,
  getInvoiceByIDQuery,
  updateInvoiceQuery,
} from '@/queries/invoice.query';
import { Invoice } from '@prisma/client';

const createInvoiceAction = async (data: IInvoice): Promise<Invoice> => {
  try {
    const invoice = await createInvoiceQuery(data, data.userId);
    return invoice;
  } catch (err) {
    throw err;
  }
};

const getInvoiceByIDAction = async (id: string): Promise<Invoice | null> => {
  try {
    const invoice = await getInvoiceByIDQuery(id);

    if (!invoice) throw new HttpException(404, 'Data not found');

    return invoice;
  } catch (err) {
    throw err;
  }
};

const updateInvoiceAction = async (
  id: string,
  invoiceData: IInvoice,
): Promise<Invoice> => {
  try {
    const invoice = await updateInvoiceQuery(id, invoiceData);
    return invoice;
  } catch (err) {
    throw err;
  }
};

export { createInvoiceAction, getInvoiceByIDAction, updateInvoiceAction };
