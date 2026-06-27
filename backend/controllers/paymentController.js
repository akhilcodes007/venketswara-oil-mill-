import crypto from "crypto";
import razorpay, { isSimulator } from "../config/razorpay.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Notification from "../models/Notification.js";
import { emitNotification } from "../utils/socket.js";

/**
 * Creates a Razorpay order.
 */
export async function createRazorpayOrder(req, res) {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const options = {
      amount: Math.round(order.total * 100), // Convert Rs to Paise
      currency: "INR",
      receipt: `receipt_order_${order._id.toString().slice(0, 8)}`,
      notes: {
        orderId: order._id.toString(),
        customerName: order.customer_name,
      },
    };

    const rpOrder = await razorpay.orders.create(options);
    res.status(200).json(rpOrder);
  } catch (error) {
    console.error("[Payment Controller] Create Razorpay Order Error:", error);
    res.status(500).json({ message: "Server error generating payment details" });
  }
}

/**
 * Verifies Razorpay payment signatures and logs transactions.
 */
export async function verifyPayment(req, res) {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    let isSignatureValid = false;

    if (isSimulator) {
      // In simulator mode, mock payment passes automatically
      isSignatureValid = true;
      console.log(`[Payment Simulator] Mock Payment verified for Order ${orderId}`);
    } else {
      // Verify signature using HMAC-SHA256
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      isSignatureValid = expectedSignature === razorpay_signature;
    }

    if (!isSignatureValid) {
      // Log payment failure
      await Payment.create({
        customerName: order.customer_name,
        user_id: order.user_id,
        orderId: order._id,
        paymentMethod: "Online (" + order.payment_method + ")",
        amount: order.total,
        status: "failed",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      });

      order.payment_status = "failed";
      await order.save();

      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Payment is successful
    order.payment_status = "completed";
    await order.save();

    const paymentLog = await Payment.create({
      customerName: order.customer_name,
      user_id: order.user_id,
      orderId: order._id,
      paymentMethod: order.payment_method || "Online Card/UPI",
      amount: order.total,
      status: "completed",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      location: order.address.split(",").slice(-2).join(",").trim(), // Rough city/state extraction
    });

    // Create Notification
    const adminMsg = `Payment Successful: Received ₹${order.total} from ${order.customer_name} for order #${order._id.toString().slice(0, 8).toUpperCase()}`;
    await Notification.create({
      message: adminMsg,
      type: "payment",
    });

    // Emit live to Socket
    emitNotification("admin", "payment", {
      paymentId: paymentLog._id,
      orderId: order._id,
      customerName: order.customer_name,
      amount: order.total,
    });

    if (order.user_id) {
      emitNotification(order.user_id, "payment_status", {
        orderId: order._id,
        status: "completed",
        message: "Your payment was processed successfully!",
      });
    }

    res.status(200).json({ message: "Payment verified successfully", order });
  } catch (error) {
    console.error("[Payment Controller] Verify Payment Error:", error);
    res.status(500).json({ message: "Server error verifying payment status" });
  }
}

/**
 * Gets payment logs (Payment Management Table data).
 */
export async function getPaymentHistory(req, res) {
  try {
    const history = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error("[Payment Controller] Get Payments History Error:", error);
    res.status(500).json({ message: "Server error retrieving transaction logs" });
  }
}
