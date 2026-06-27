import nodemailer from "nodemailer";

let transporter;

async function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // If using Ethereal with default/empty settings, auto-generate a test account
  if (host === "smtp.ethereal.email" && (!user || user === "mock_user@ethereal.email" || !pass || pass === "mock_password")) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`\n======================================================`);
      console.log(`[Email Service] Created test account: ${testAccount.user}`);
      console.log(`[Email Service] Use Ethereal credentials to log in at https://ethereal.email/`);
      console.log(`======================================================\n`);
      return transporter;
    } catch (err) {
      console.error("[Email Service] Failed to create test account, falling back to basic logger", err);
    }
  }

  transporter = nodemailer.createTransport({
    host: host || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
    auth: {
      user: user || "mock_user",
      pass: pass || "mock_pass",
    },
  });
  return transporter;
}

export async function sendOtpEmail(email, code) {
  try {
    const client = await getTransporter();
    const info = await client.sendMail({
      from: process.env.SMTP_FROM || '"Sri Venkateshwara Oil Mill" <noreply@svem.com>',
      to: email,
      subject: `Your Login Code: ${code}`,
      text: `Your one-time verification code to sign in is: ${code}. It expires in 5 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4A3B32; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Sri Venkateshwara Oil Mill</h2>
          <p>Hello,</p>
          <p>You requested a one-time verification code to access your account.</p>
          <div style="background-color: #fcf8e3; border: 1px solid #faebcc; border-radius: 5px; text-align: center; padding: 15px; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #8a6d3b;">${code}</span>
          </div>
          <p style="font-size: 12px; color: #777;">This code is valid for 5 minutes. If you did not request this code, you can safely ignore this email.</p>
        </div>
      `,
    });

    console.log(`[Email Service] Sent OTP email to ${email}`);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`[Email Service] Ethereal URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return { success: true };
  } catch (error) {
    console.error(`[Email Service] Error sending OTP to ${email}:`, error.message);
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n------------------------------------------------------`);
      console.log(`[Email Service] [Dev-Fallback] OTP code to ${email} is: ${code}`);
      console.log(`------------------------------------------------------\n`);
      return { success: true, warning: error.message };
    }
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email, link) {
  try {
    const client = await getTransporter();
    const info = await client.sendMail({
      from: process.env.SMTP_FROM || '"Sri Venkateshwara Oil Mill" <noreply@svem.com>',
      to: email,
      subject: "Password Reset Request",
      text: `Click the link below to reset your password. The link is valid for 1 hour.\n\n${link}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4A3B32; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Sri Venkateshwara Oil Mill</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" style="background-color: #4A3B32; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="font-size: 12px; color: #777;">If you did not request a password reset, no action is needed. The link expires in 1 hour.</p>
        </div>
      `,
    });

    console.log(`[Email Service] Sent reset link to ${email}`);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`[Email Service] Ethereal URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return { success: true };
  } catch (error) {
    console.error(`[Email Service] Error sending reset link to ${email}:`, error.message);
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n------------------------------------------------------`);
      console.log(`[Email Service] [Dev-Fallback] Password reset link to ${email} is: ${link}`);
      console.log(`------------------------------------------------------\n`);
      return { success: true, warning: error.message };
    }
    return { success: false, error };
  }
}

export async function sendInvoiceEmail(email, order, pdfBuffer) {
  try {
    const client = await getTransporter();
    const info = await client.sendMail({
      from: process.env.SMTP_FROM || '"Sri Venkateshwara Oil Mill" <noreply@svem.com>',
      to: email,
      subject: `Invoice for Order #${order._id.toString().slice(0, 8).toUpperCase()}`,
      text: `Thank you for your purchase, ${order.customer_name}! Your order has been confirmed. Please find your invoice receipt attached.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4A3B32; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Sri Venkateshwara Oil Mill</h2>
          <p>Dear ${order.customer_name},</p>
          <p>Thank you for shopping with Sri Venkateshwara Oil Mill! Your order is confirmed and is currently being processed.</p>
          <h3>Order Summary</h3>
          <p>
            <strong>Order ID:</strong> #${order._id.toString().slice(0, 8).toUpperCase()}<br/>
            <strong>Total Amount Paid:</strong> ₹${order.total}<br/>
            <strong>Payment Method:</strong> ${order.payment_method}
          </p>
          <p>Please find your official PDF invoice receipt attached to this email.</p>
          <br/>
          <p>Warm regards,<br/>Sri Venkateshwara Oil Mill Team</p>
        </div>
      `,
      attachments: [
        {
          filename: `invoice_${order._id.toString().slice(0, 8).toUpperCase()}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    console.log(`[Email Service] Sent invoice attachment to ${email}`);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`[Email Service] Ethereal URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return { success: true };
  } catch (error) {
    console.error(`[Email Service] Error sending invoice email to ${email}:`, error.message);
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n------------------------------------------------------`);
      console.log(`[Email Service] [Dev-Fallback] PDF Invoice email to ${email} is simulated. (Invoice generated)`);
      console.log(`------------------------------------------------------\n`);
      return { success: true, warning: error.message };
    }
    return { success: false, error };
  }
}
