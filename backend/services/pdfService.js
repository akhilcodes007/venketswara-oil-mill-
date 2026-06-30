import PDFDocument from 'pdfkit';

/**
 * generateInvoicePdf — Generates a styled PDF invoice for a given order.
 *
 * The PDF includes:
 *  - Company header with address
 *  - Invoice metadata (invoice number, order ID, date, payment method)
 *  - Customer billing details
 *  - Line-item table (product, size, price, qty, total)
 *  - Subtotal / discount / GST / shipping breakdown
 *  - Grand total in bold
 *  - Footer with support contact
 *
 * @param {Object} order          - Order document from Supabase
 * @param {string} invoiceNumber  - Human-readable invoice number (e.g. "INV-202406-0001")
 * @returns {Promise<Buffer>}     - Resolves with the PDF as a Buffer
 */
export function generateInvoicePdf(order, invoiceNumber) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const orderId = (order.id || order._id || '').toString().slice(0, 8).toUpperCase();

      // ── Header ──────────────────────────────────────────────────────────
      doc
        .fillColor('#4A3B32')
        .fontSize(22)
        .text('Sri Venkateshwara Oil Mill', 50, 45);

      doc
        .fontSize(10)
        .fillColor('#6b7280')
        .text('Tradition, Purity & Health · ESTD 1919', 50, 72);

      // Company contact block (right-aligned)
      doc
        .fillColor('#374151')
        .text('No. 12, Mill Road, Tamil Nadu, India', 200, 45, { align: 'right' })
        .text('Email: support@svem.com', 200, 60, { align: 'right' })
        .text('WhatsApp: +91 98765 43210', 200, 75, { align: 'right' });

      // Divider
      doc.moveTo(50, 100).lineTo(550, 100).strokeColor('#e5e7eb').stroke();

      // ── Invoice metadata ─────────────────────────────────────────────────
      doc.fillColor('#4A3B32').fontSize(14).text('TAX INVOICE', 50, 115);

      doc
        .fillColor('#374151')
        .fontSize(10)
        .text(`Invoice No: ${invoiceNumber}`, 50, 135)
        .text(`Order ID: #${orderId}`, 50, 150)
        .text(
          `Date: ${new Date(
            order.created_at || order.createdAt || Date.now()
          ).toLocaleDateString('en-IN')}`,
          50,
          165
        )
        .text(`Payment: ${order.payment_method}`, 50, 180);

      // ── Customer billing info ─────────────────────────────────────────────
      doc.fillColor('#4A3B32').fontSize(11).text('BILLED TO:', 350, 115);

      doc
        .fillColor('#374151')
        .fontSize(10)
        .text(order.customer_name, 350, 135)
        .text(`Phone: ${order.phone}`, 350, 150)
        .text(order.email || '', 350, 165)
        .text(order.address, 350, 180, { width: 195 });

      // ── Items table ───────────────────────────────────────────────────────
      let y = 230;

      // Table header divider
      doc.moveTo(50, y).lineTo(550, y).strokeColor('#e5e7eb').stroke();
      y += 12;

      // Column headers
      doc
        .fillColor('#4A3B32')
        .fontSize(10)
        .text('Product', 55, y)
        .text('Size', 220, y)
        .text('Price', 300, y)
        .text('Qty', 380, y)
        .text('Total', 460, y, { align: 'right' });

      y += 14;
      doc.moveTo(50, y).lineTo(550, y).strokeColor('#e5e7eb').stroke();
      y += 10;

      // Item rows
      doc.fillColor('#374151');
      const items = Array.isArray(order.items) ? order.items : [];
      items.forEach((item) => {
        doc
          .text(item.name, 55, y, { width: 155 })
          .text(item.size, 220, y)
          .text(`₹${item.price}`, 300, y)
          .text(String(item.qty), 380, y)
          .text(`₹${item.price * item.qty}`, 460, y, { align: 'right' });
        y += 22;
      });

      // Bottom divider
      doc.moveTo(50, y).lineTo(550, y).strokeColor('#e5e7eb').stroke();
      y += 14;

      // ── Totals summary ────────────────────────────────────────────────────
      const summaryX = 320;

      doc
        .fillColor('#374151')
        .fontSize(10)
        .text('Subtotal:', summaryX, y)
        .text(`₹${order.subtotal}`, 460, y, { align: 'right' });
      y += 15;

      if (order.discount > 0) {
        doc
          .text(`Discount (${order.coupon || ''})`, summaryX, y)
          .text(`-₹${order.discount}`, 460, y, { align: 'right' });
        y += 15;
      }

      doc
        .text('GST (5%):', summaryX, y)
        .text(`₹${order.gst}`, 460, y, { align: 'right' });
      y += 15;

      doc
        .text('Shipping:', summaryX, y)
        .text(order.shipping === 0 ? 'Free' : `₹${order.shipping}`, 460, y, {
          align: 'right',
        });
      y += 18;

      doc.moveTo(summaryX, y).lineTo(550, y).strokeColor('#e5e7eb').stroke();
      y += 10;

      // Grand total (bold)
      doc
        .fillColor('#4A3B32')
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('Grand Total:', summaryX, y)
        .text(`₹${order.total}`, 460, y, { align: 'right' });

      // ── Footer ────────────────────────────────────────────────────────────
      doc
        .fillColor('#9ca3af')
        .fontSize(8)
        .text(
          'Thank you for your business. For support, WhatsApp: +91 98765 43210',
          50,
          720,
          { align: 'center', width: 500 }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
