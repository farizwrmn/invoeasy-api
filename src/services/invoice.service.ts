import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createRecurringInvoice = async (invoice: any) => {
  try {
    const newInvoice = await prisma.invoice.create({
      data: {
        userId: invoice.userId,
        customerId: invoice.customerId,
        invoiceDate: new Date(),
        dueDate: calculateDueDate(new Date()),
        status: 'Pending',
        products: {
          create: invoice.products.map((product: any) => ({
            itemId: product.itemId,
            productId: product.productId,
            quantity: product.quantity,
            price: product.price,
          })),
        },
        termsCondition: invoice.termsCondition,
        tax: invoice.tax,
        totalPrice: invoice.totalPrice,
      },
      include: {
        products: true,
      },
    });

    return newInvoice;
  } catch (error) {
    console.error('Error creating recurring invoice:', error);
    throw new Error('Failed to create recurring invoice');
  }
};

export const calculateDueDate = (startDate: Date, days = 30): Date => {
  const dueDate = new Date(startDate);
  dueDate.setDate(dueDate.getDate() + days);
  return dueDate;
};

export function calculateNextInvoiceDate(invoice: any): Date | null {
  const nextInvoiceDate = new Date(invoice.nextInvoiceDate);
  if (invoice.recurrenceType === 'weekly') {
    nextInvoiceDate.setDate(nextInvoiceDate.getDate() + 7);
  } else if (invoice.recurrenceType === 'monthly') {
    nextInvoiceDate.setMonth(nextInvoiceDate.getMonth() + 1);
  }
  return nextInvoiceDate;
}
