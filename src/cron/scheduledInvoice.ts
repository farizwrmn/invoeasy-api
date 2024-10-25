import cron from 'node-cron';
import { createRecurringInvoice } from '@/services/invoice.service';
import { sendInvoiceEmail } from '@/helpers/nodemailer';
import { generateInvoicePDF } from '@/helpers/pdfkit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const scheduledInvoice = () => {
  cron.schedule('* * * * *', async () => {
    console.log('Scheduler triggered at:', new Date());

    try {
      const now = new Date();

      await prisma.invoice.updateMany({
        where: {
          status: 'Pending',
          dueDate: {
            lt: now,
          },
        },
        data: {
          status: 'Expired',
        },
      });

      const recurringInvoices = await prisma.invoice.findMany({
        where: {
          nextInvoiceDate: {
            lte: now,
          },
          recurrenceType: {
            not: null,
          },
        },
        include: {
          customer: true,
          products: true,
          user: true,
        },
      });

      for (const invoice of recurringInvoices) {
        const newInvoice = await createRecurringInvoice(invoice);

        await sendInvoiceEmail({
          to: invoice.customer?.customerEmail ?? '',
          subject: `Invoice ${invoice.invoiceNumber} - Invoeasy`,
          text: `Please find attached the invoice ${invoice.invoiceNumber}`,
          attachmentPath: generateInvoicePDF(
            invoice,
            invoice.customer,
            invoice.user,
          ),
        });

        let nextInvoiceDate = new Date(invoice.nextInvoiceDate ?? now);
        if (invoice.recurrenceType === 'weekly') {
          nextInvoiceDate.setDate(nextInvoiceDate.getDate() + 7);
        } else if (invoice.recurrenceType === 'monthly') {
          nextInvoiceDate.setMonth(nextInvoiceDate.getMonth() + 1);
        } else if (invoice.recurrenceType === 'yearly') {
          nextInvoiceDate.setFullYear(nextInvoiceDate.getFullYear() + 1);
        }

        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { nextInvoiceDate: nextInvoiceDate },
        });
      }
      console.log('Processing recurring invoices...');
    } catch (error) {
      console.error('Error processing recurring invoices:', error);
      console.error('Error during cron job:', error);
    }
  });
};
