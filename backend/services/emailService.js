import nodemailer from 'nodemailer';

let transporter;

/**
 * getTransporter — Lazily initialises the Nodemailer transporter.
 *
 * Development mode (Ethereal):
 *   If SMTP credentials are the placeholder values, a free Ethereal test
 *   account is created automatically. Preview URLs for every sent email
 *   are printed to the console.
 *
 * Production mode:
 *   Uses the SMTP_* environment variables as-is.
 */
async function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const isEtherealPlaceholder =
    host === 'smtp.ethereal.email' &&
    (!user || user === 'mock_user@ethereal.email' || !pass || pass === 'mock_password');

  if (isEtherealPlaceholder) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      console.log(`\n[Email Service] Test account: ${testAccount.user}`);
      console.log(`[Email Service] View sent emails at: https://ethereal.email/\n`);
      return transporter;
    } catch (err) {
      console.error('[Email Service] Failed to create Ethereal test account:', err.message);
    }
  }

  // Real SMTP transporter
  transporter = nodemailer.createTransport({
    host: host || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth: { user: user || '', pass: pass || '' },
  });

  return transporter;
}

const FROM =
  process.env.SMTP_FROM || '"Sri Venkateshwara Oil Mill" <noreply@svem.com>';

/* ------------------------------------------------------------------ */
/* sendOtpEmail                                                         */
/* ------------------------------------------------------------------ */

/**
 * Sends a styled OTP verification email.
 * In dev, if sending fails, the OTP is logged to the console as a fallback.
 */
export async function sendOtpEmail(email, code) {
  try {
    const client = await getTransporter();
    const info = await client.sendMail({
      from: FROM,
      to: email,
      subject: `Your Login Code: ${code}`,
      html: `
        <div style="font-family:sans-serif;padding:24px;max-width:520px;margin:auto;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#4A3B32;border-bottom:2px solid #D4AF37;padding-bottom:8px">Sri Venkateshwara Oil Mill</h2>
          <p style="color:#374151">Hello,</p>
          <p style="color:#374151">Your one-time verification code is:</p>
          <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;text-align:center;padding:20px;margin:20px 0">
            <span style="font-size:32px;font-weight:bold;letter-spacing:10px;color:#92400e">${code}</span>
          </div>
          <p style="font-size:12px;color:#9ca3af">Valid for 5 minutes. Do not share this code with anyone.</p>
        </div>`,
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Email Service] OTP preview: ${previewUrl}`);
    }
    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Email Dev] OTP for ${email}: ${code}`);
      return { success: true };
    }
    return { success: false, error: error.message };
  }
}

/* ------------------------------------------------------------------ */
/* sendPasswordResetEmail                                               */
/* ------------------------------------------------------------------ */

/**
 * Sends a password-reset link email.
 */
export async function sendPasswordResetEmail(email, link) {
  try {
    const client = await getTransporter();
    const info = await client.sendMail({
      from: FROM,
      to: email,
      subject: 'Password Reset — Sri Venkateshwara Oil Mill',
      html: `
        <div style="font-family:sans-serif;padding:24px;max-width:520px;margin:auto;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#4A3B32;border-bottom:2px solid #D4AF37;padding-bottom:8px">Sri Venkateshwara Oil Mill</h2>
          <p>Click the button below to reset your password:</p>
          <div style="text-align:center;margin:30px 0">
            <a href="${link}" style="background:#4A3B32;color:#fff;padding:12px 28px;text-decoration:none;border-radius:8px;font-weight:bold">Reset Password</a>
          </div>
          <p style="font-size:12px;color:#9ca3af">This link expires in 1 hour. If you did not request a password reset, please ignore this email.</p>
        </div>`,
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Email Service] Reset preview: ${previewUrl}`);
    }
    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Email Dev] Reset link for ${email}: ${link}`);
      return { success: true };
    }
    return { success: false, error: error.message };
  }
}

/* ------------------------------------------------------------------ */
/* sendInvoiceEmail                                                     */
/* ------------------------------------------------------------------ */

/**
 * Sends the order invoice as a PDF attachment.
 *
 * @param {string} email       - Recipient email address
 * @param {Object} order       - Order document from Supabase
 * @param {Buffer} pdfBuffer   - PDF buffer generated by pdfService
 */
export async function sendInvoiceEmail(email, order, pdfBuffer) {
  try {
    const client = await getTransporter();
    const orderId = (order.id || order._id || '').toString().slice(0, 8).toUpperCase();
    const info = await client.sendMail({
      from: FROM,
      to: email,
      subject: `Invoice for Order #${orderId} — Sri Venkateshwara Oil Mill`,
      html: `
        <div style="font-family:sans-serif;padding:24px;max-width:520px;margin:auto;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#4A3B32;border-bottom:2px solid #D4AF37;padding-bottom:8px">Sri Venkateshwara Oil Mill</h2>
          <p>Dear ${order.customer_name},</p>
          <p>Thank you for your order! Please find your invoice attached.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr><td style="color:#6b7280;padding:4px 0">Order ID</td><td style="font-weight:600">#${orderId}</td></tr>
            <tr><td style="color:#6b7280;padding:4px 0">Total</td><td style="font-weight:600">₹${order.total}</td></tr>
            <tr><td style="color:#6b7280;padding:4px 0">Payment</td><td>${order.payment_method}</td></tr>
          </table>
          <p style="color:#6b7280;font-size:13px">Warm regards,<br/>Sri Venkateshwara Oil Mill Team</p>
        </div>`,
      attachments: [
        { filename: `invoice_${orderId}.pdf`, content: pdfBuffer },
      ],
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Email Service] Invoice preview: ${previewUrl}`);
    }
    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Email Dev] Invoice email simulated for ${email}`);
      return { success: true };
    }
    return { success: false, error: error.message };
  }
}

/* ------------------------------------------------------------------ */
/* sendOrderStatusEmail                                                 */
/* ------------------------------------------------------------------ */

/**
 * Notifies a customer by email when their order status changes.
 *
 * @param {string} email        - Customer's email address
 * @param {string} customerName - Customer's display name
 * @param {string} orderId      - Supabase order UUID
 * @param {string} status       - New order status key
 */
export async function sendOrderStatusEmail(email, customerName, orderId, status) {
  const statusLabels = {
    confirmed: 'Confirmed ✅',
    packed: 'Packed 📦',
    shipped: 'Shipped 🚚',
    out_for_delivery: 'Out for Delivery 🛵',
    delivered: 'Delivered 🎉',
    cancelled: 'Cancelled ❌',
  };

  try {
    const client = await getTransporter();
    const shortId = orderId.slice(0, 8).toUpperCase();
    await client.sendMail({
      from: FROM,
      to: email,
      subject: `Order #${shortId} — ${statusLabels[status] || status}`,
      html: `
        <div style="font-family:sans-serif;padding:24px;max-width:520px;margin:auto;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#4A3B32;border-bottom:2px solid #D4AF37;padding-bottom:8px">Sri Venkateshwara Oil Mill</h2>
          <p>Dear ${customerName},</p>
          <p>Your order <strong>#${shortId}</strong> status has been updated to:</p>
          <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;text-align:center;padding:16px;margin:16px 0">
            <span style="font-size:20px;font-weight:bold;color:#15803d">${statusLabels[status] || status}</span>
          </div>
          <p style="color:#6b7280;font-size:13px">Thank you for shopping with Sri Venkateshwara Oil Mill.</p>
        </div>`,
    });
    return { success: true };
  } catch (error) {
    console.error('[Email Service] Status email error:', error.message);
    return { success: false };
  }
}
