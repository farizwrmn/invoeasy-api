const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

export const generateInvoicePDF = (invoice: any, customer: any, user: any) => {
  const invoicesDir = path.join(__dirname, 'invoices');
  const fileName = `Invoeasy-${invoice.invoiceNumber}.pdf`;
  const filePath = path.join(invoicesDir, fileName);
  const formatDateAsNumber = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const createdDateNumber = formatDateAsNumber(new Date(user.createdDate));
  const updatedDateNumber = formatDateAsNumber(new Date(user.updatedDate));

  const logoPath = path.join(
    __dirname,
    '..',
    '..',
    'public',
    'assets',
    'logo.png',
  );

  const doc = new PDFDocument({ margin: 50 });

  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  doc.pipe(fs.createWriteStream(filePath));

  doc
    .opacity(0)
    .rotate(-45, { origin: [300, 400] })
    .image(logoPath, 100, 250, { width: 400 })
    .rotate(45, { origin: [300, 400] })
    .opacity(1);

  doc.rect(50, 30, 520, 100).fill('#f4f4f4').stroke();
  doc
    .fontSize(24)
    .fillColor('#333')
    .text('INVOICE', 60, 40, { align: 'center' })
    .fontSize(12)
    .text(`Invoice Number: ${invoice.invoiceNumber}`, 60, 70, { align: 'left' })
    .text(
      `Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`,
      60,
      85,
      { align: 'left' },
    )
    .text(
      `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`,
      60,
      100,
      { align: 'left' },
    )
    .moveDown(1);

  doc
    .fontSize(12)
    .fillColor('#333')
    .text('Bill To:', 60, 140, { align: 'left' })
    .font('Helvetica-Bold')
    .text(customer?.name, 60, 155, { align: 'left' })
    .font('Helvetica')
    .text(customer?.address, 60, 170, { align: 'left' });

  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor('#333')
    .text(`Status: ${invoice.status.toUpperCase()}`, 60, 140, {
      align: 'right',
    });

  doc.rect(50, 220, 520, 20).fill('#f4f4f4').stroke();
  doc
    .fillColor('#333')
    .font('Helvetica-Bold')
    .text('Description', 60, 225, { align: 'left' })
    .text('Quantity', 190, 225, { align: 'center' })
    .text('Price', 345, 225, { align: 'right' })
    .moveDown(0.5);

  let y = 250;
  let subtotal = 0;

  if (Array.isArray(invoice.products)) {
    invoice.products.forEach((item: any, index: number) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      doc
        .fillColor('#333')
        .font('Helvetica')
        .text(item.name, 60, y, { align: 'left' })
        .text(item.quantity.toString(), 190, y, { align: 'center' })
        .text(
          `Rp. ${item.price.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`,
          345,
          y,
          { align: 'right' },
        );

      y += 20;
    });
  }

  const taxAmount = (invoice.tax / 100) * subtotal;
  const total = subtotal + taxAmount;

  doc
    .rect(50, y + 10, 520, 60)
    .fill('#f4f4f4')
    .stroke();
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor('#333')
    .text(
      `Subtotal: Rp. ${subtotal.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`,
      330,
      y + 15,
      { align: 'right' },
    )
    .text(
      `Tax (${invoice.tax || 0}%): Rp. ${taxAmount.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`,
      330,
      y + 30,
      { align: 'right' },
    )
    .text(
      `Total Amount: Rp. ${total.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`,
      330,
      y + 45,
      { align: 'right' },
    );

  doc
    .fontSize(10)
    .fillColor('#333')
    .text('Terms and Conditions:', 50, y + 90, { align: 'left' })
    .font('Helvetica')
    .text(invoice.termsCondition, 50, y + 105, {
      align: 'left',
      width: 500,
    })
    .moveDown(1);

  doc
    .fontSize(10)
    .fillColor('#333')
    .text('Thank you for your business!', 50, y + 150, { align: 'center' })
    .text(
      'If you have any questions about this invoice, please contact us.',
      50,
      y + 165,
      { align: 'center' },
    )
    .moveDown(1);

  doc
    .fontSize(10)
    .fillColor('#333')
    .font('Helvetica')
    .text(`${user.name}`, 50, y + 240, { align: 'left' })
    .text(`Phone: ${user.phone}`, 50, y + 255, { align: 'left' })
    .text(`Email: ${user.email}`, 50, y + 270, { align: 'left' })
    .text(`Company Registration Number: ${createdDateNumber}`, 50, y + 285, {
      align: 'left',
    })
    .text(`VAT Number: ${updatedDateNumber}`, 50, y + 300, { align: 'left' })
    .moveDown(1);

  doc
    .fontSize(9)
    .font('Helvetica-Oblique')
    .text(
      'Terms and conditions apply. This invoice is not valid for tax purposes unless signed by an authorized representative of the company.',
      50,
      y + 365,
      { align: 'left', width: 500 },
    );
  doc.end();
  return filePath;
};
