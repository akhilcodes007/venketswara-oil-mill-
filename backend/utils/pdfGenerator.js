import PDFDocument from "pdfkit";

/**
 * Generates a PDF invoice buffer for an order.
 * @param {Object} order - The order document from database.
 * @param {String} invoiceNumber - The unique invoice number.
 * @returns {Promise<Buffer>} - Resolves to the PDF file buffer.
 */
export function generateInvoicePdf(order, invoiceNumber) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      // 1. Header
      doc
        .fillColor("#4A3B32")
        .fontSize(20)
        .text("Sri Venkateshwara Oil Mill", 50, 45)
        .fontSize(10)
        .text("Tradition, Purity & Health", 50, 70)
        .text("ESTD · 1919", 50, 85)
        .moveDown();

      // Company Info (Right Side)
      doc
        .fillColor("#333333")
        .text("Sri Venkateshwara Oil Mill", 200, 45, { align: "right" })
        .text("No. 12, Mill Road, Village Area,", 200, 60, { align: "right" })
        .text("Tamil Nadu, India - 600001", 200, 75, { align: "right" })
        .text("Email: support@svem.com", 200, 90, { align: "right" })
        .moveDown();

      doc.moveTo(50, 115).lineTo(550, 115).stroke("#cccccc");

      // 2. Invoice Meta & Client details
      doc
        .fontSize(12)
        .fillColor("#4A3B32")
        .text("INVOICE RECEIPT", 50, 130)
        .fontSize(10)
        .fillColor("#333333")
        .text(`Invoice Number: ${invoiceNumber}`, 50, 150)
        .text(`Order ID: #${order._id.toString().slice(0, 8).toUpperCase()}`, 50, 165)
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 180)
        .text(`Payment Method: ${order.payment_method}`, 50, 195);

      // Customer Details (Right Side)
      doc
        .fontSize(12)
        .fillColor("#4A3B32")
        .text("BILLED TO:", 350, 130)
        .fontSize(10)
        .fillColor("#333333")
        .text(order.customer_name, 350, 150)
        .text(`Phone: ${order.phone}`, 350, 165)
        .text(order.email || "", 350, 180)
        .text(order.address, 350, 195, { width: 200 });

      doc.moveDown(4);

      // Table Header
      let currentHeight = 270;
      doc.moveTo(50, currentHeight).lineTo(550, currentHeight).stroke("#cccccc");
      currentHeight += 10;

      doc
        .fontSize(10)
        .fillColor("#4A3B32")
        .text("Product", 55, currentHeight)
        .text("Size", 220, currentHeight)
        .text("Price", 300, currentHeight)
        .text("Qty", 380, currentHeight)
        .text("Total", 460, currentHeight, { align: "right" });

      currentHeight += 15;
      doc.moveTo(50, currentHeight).lineTo(550, currentHeight).stroke("#cccccc");
      currentHeight += 10;

      // Table Items
      doc.fillColor("#333333");
      order.items.forEach((item) => {
        const itemTotal = item.price * item.qty;
        doc
          .text(item.name, 55, currentHeight, { width: 155 })
          .text(item.size, 220, currentHeight)
          .text(`₹${item.price}`, 300, currentHeight)
          .text(item.qty.toString(), 380, currentHeight)
          .text(`₹${itemTotal}`, 460, currentHeight, { align: "right" });

        currentHeight += 20;
      });

      doc.moveTo(50, currentHeight).lineTo(550, currentHeight).stroke("#cccccc");
      currentHeight += 15;

      // 3. Summary block (bottom right)
      const summaryLeft = 320;
      doc
        .text("Subtotal:", summaryLeft, currentHeight)
        .text(`₹${order.subtotal}`, 460, currentHeight, { align: "right" });
      currentHeight += 15;

      if (order.discount > 0) {
        doc
          .text(`Discount (${order.coupon || ""}):`, summaryLeft, currentHeight)
          .text(`- ₹${order.discount}`, 460, currentHeight, { align: "right" });
        currentHeight += 15;
      }

      doc
        .text("GST (5%):", summaryLeft, currentHeight)
        .text(`₹${order.gst}`, 460, currentHeight, { align: "right" });
      currentHeight += 15;

      doc
        .text("Shipping:", summaryLeft, currentHeight)
        .text(order.shipping === 0 ? "Free" : `₹${order.shipping}`, 460, currentHeight, { align: "right" });
      currentHeight += 20;

      doc.moveTo(summaryLeft, currentHeight).lineTo(550, currentHeight).stroke("#cccccc");
      currentHeight += 10;

      doc
        .fontSize(12)
        .fillColor("#4A3B32")
        .text("Grand Total:", summaryLeft, currentHeight)
        .text(`₹${order.total}`, 460, currentHeight, { align: "right" });

      // Footer notice
      doc
        .fontSize(8)
        .fillColor("#777777")
        .text("Thank you for your business. For any support, WhatsApp us at +91 98765 43210.", 50, 720, {
          align: "center",
          width: 500,
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
