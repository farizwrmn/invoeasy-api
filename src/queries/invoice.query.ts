import { IInvoice } from '@/interfaces/invoice.interface';
import { Invoice, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createInvoiceQuery = async (
  invoiceData: IInvoice,
  userId: string,
): Promise<Invoice> => {
  try {
    const trx = await prisma.$transaction(async (prisma) => {
      try {
        const invoice = await prisma.invoice.create({
          data: {
            ...invoiceData,
            userId: userId,
            products: {
              create: invoiceData.products.map((product) => ({
                itemId: product.itemId,
                quantity: product.quantity,
                price: product.price,
                name: product.name,
              })),
            },
          },
          include: {
            products: true,
          },
        });

        return invoice;
      } catch (err) {
        throw err;
      }
    });

    return trx;
  } catch (err) {
    throw err;
  }
};

const softDeleteInvoice = async (invoiceId: string): Promise<Invoice> => {
  try {
    const invoice = await prisma.invoice.update({
      where: {
        id: invoiceId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return invoice;
  } catch (err) {
    throw err;
  }
};

const getInvoiceByIDQuery = async (id: string): Promise<Invoice | null> => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: {
        id,
      },
    });

    return invoice;
  } catch (err) {
    throw err;
  }
};

const updateInvoiceQuery = async (
  id: string,
  invoiceData: IInvoice,
): Promise<Invoice> => {
  try {
    const address = await prisma.invoice.update({
      data: {
        ...invoiceData,
        products: {},
      },
      where: {
        id,
      },
    });

    return address;
  } catch (err) {
    throw err;
  }
};

export {
  createInvoiceQuery,
  softDeleteInvoice,
  getInvoiceByIDQuery,
  updateInvoiceQuery,
};
