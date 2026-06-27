import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Invoice from "../models/Invoice.js";
import DeliveryTracking from "../models/DeliveryTracking.js";
import Notification from "../models/Notification.js";
import { generateInvoicePdf } from "../utils/pdfGenerator.js";
import { sendInvoiceEmail } from "../utils/emailService.js";
import { sendSmsNotification, sendWhatsAppNotification } from "../utils/smsService.js";
import { emitNotification } from "../utils/socket.js";

/**
 * Places a new order, validates stock, updates inventory, generates invoice and triggers alerts.
 */
export async function createOrder(req, res) {
  const {
    customer_name,
    phone,
    email,
    address,
    items,
    subtotal,
    gst,
    shipping,
    discount,
    total,
    coupon,
    payment_method,
  } = req.body;

  const userId = req.user ? req.user._id.toString() : null;
  const userEmail = req.user ? req.user.email : email;

  try {
    // 1. Inventory Validation & Stock Reservation
    for (const item of items) {
      const dbProduct = await Product.findOne({ id: item.id });
      if (!dbProduct) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }

      // If product tracks stock and is out
      if (dbProduct.stock !== undefined && dbProduct.stock < item.qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.name}. Only ${dbProduct.stock} unit(s) remaining.`,
        });
      }
    }

    // 2. Create Order in database
    // Default online payments to "pending" status, Cash to "completed" or "pending"
    const paymentStatus = payment_method === "Cash on Delivery" ? "pending" : "pending";

    const order = await Order.create({
      user_id: userId,
      customer_name,
      phone,
      email: userEmail,
      address,
      items,
      subtotal,
      gst,
      shipping,
      discount,
      total,
      coupon,
      payment_method,
      payment_status: paymentStatus,
      status: "confirmed",
    });

    // 3. Deduct stock and check for low stock alerts
    for (const item of items) {
      const updatedProduct = await Product.findOneAndUpdate(
        { id: item.id },
        { $inc: { stock: -item.qty } },
        { new: true }
      );

      // Low stock warning (e.g. less than 5 units left)
      if (updatedProduct && updatedProduct.stock <= 5) {
        const message = `Low stock alert: Only ${updatedProduct.stock} left for ${updatedProduct.name}`;
        
        // Save alert notification
        await Notification.create({
          message,
          type: "low_stock",
        });

        // Socket.io emit to admin
        emitNotification("admin", "low_stock", {
          productId: updatedProduct.id,
          name: updatedProduct.name,
          stock: updatedProduct.stock,
        });
      }
    }

    // 4. Generate unique Invoice Number and PDF
    const randomInvoiceSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${randomInvoiceSuffix}`;
    
    const pdfBuffer = await generateInvoicePdf(order, invoiceNumber);

    // Save Invoice logging in DB
    await Invoice.create({
      orderId: order._id,
      invoiceNumber,
    });

    // 5. Initialize Delivery Tracking
    const trackingHistory = [{ status: "confirmed", location: "Mill Warehouse", timestamp: new Date() }];
    
    // Add estimated delivery date: 3 days from now
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3);

    const tracking = await DeliveryTracking.create({
      orderId: order._id,
      status: "confirmed",
      estimatedDeliveryDate,
      history: trackingHistory,
    });

    // 6. Send Invoice Email (Nodemailer) with PDF attachment
    if (userEmail) {
      // Async (non-blocking)
      sendInvoiceEmail(userEmail, order, pdfBuffer).catch((err) =>
        console.error("[Order Controller] Error emailing invoice:", err)
      );
    }

    // 7. SMS/WhatsApp Notification to customer
    const textMsg = `Order Confirmed! Your order #${order._id.toString().slice(0, 8).toUpperCase()} for ₹${total} at Sri Venkateshwara Oil Mill is confirmed. Thank you!`;
    sendSmsNotification(phone, textMsg).catch((err) =>
      console.error("[Order Controller] SMS Error:", err)
    );
    sendWhatsAppNotification(phone, textMsg).catch((err) =>
      console.error("[Order Controller] WhatsApp Error:", err)
    );

    // 8. Log Admin Notification & emit Socket event
    const adminMsg = `New order placed: Order #${order._id.toString().slice(0, 8).toUpperCase()} by ${customer_name} of ₹${total}`;
    await Notification.create({
      message: adminMsg,
      type: "new_order",
    });

    // Emit live to Socket.io Admin room
    emitNotification("admin", "new_order", {
      orderId: order._id,
      customer_name,
      total,
      payment_method,
      itemsCount: items.length,
      created_at: order.createdAt,
    });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
      invoiceNumber,
      trackingId: tracking._id,
    });
  } catch (error) {
    console.error("[Order Controller] Place Order Error:", error);
    res.status(500).json({ message: "Server error placing order" });
  }
}

/**
 * Retrieves orders. Users get their own; admins get all.
 */
export async function getOrders(req, res) {
  try {
    let orders;
    if (req.user.role === "admin") {
      orders = await Order.find().sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ user_id: req.user._id.toString() }).sort({ createdAt: -1 });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("[Order Controller] Get Orders Error:", error);
    res.status(500).json({ message: "Server error fetching orders" });
  }
}

/**
 * Admin: Updates order fulfillment status and updates tracking history.
 */
export async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["confirmed", "packed", "shipped", "out_for_delivery", "delivered"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid order status value" });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    
    // Automatically update payment status if order is COD and status is delivered
    if (status === "delivered" && order.payment_method === "Cash on Delivery") {
      order.payment_status = "completed";
    }

    await order.save();

    // Update Delivery Tracking History
    let location = "Mill Warehouse";
    if (status === "shipped") location = "Transit Hub";
    if (status === "out_for_delivery") location = "Local Delivery Office";
    if (status === "delivered") location = "Customer Doorstep";

    const coords = {
      confirmed: [77.5946, 12.9716],
      packed: [77.595, 12.972],
      shipped: [77.63, 12.94],
      out_for_delivery: [77.61, 12.95],
      delivered: [77.60, 12.96],
    };

    await DeliveryTracking.findOneAndUpdate(
      { orderId: order._id },
      {
        $set: {
          status,
          currentLocation: location,
          coordinates: coords[status] || [77.5946, 12.9716],
        },
        $push: {
          history: { status, location, timestamp: new Date() },
        },
      }
    );

    // Socket.io emit alert to customer
    if (order.user_id) {
      emitNotification(order.user_id, "order_update", {
        orderId: order._id,
        status,
        message: `Your order status has been updated to: ${status}`,
      });
    }

    // SMS notify update
    const smsText = `Order Update: Your order #${order._id.toString().slice(0, 8).toUpperCase()} is now ${status.toUpperCase().replace(/_/g, " ")}. Tracking updates available.`;
    sendSmsNotification(order.phone, smsText).catch(() => {});

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("[Order Controller] Update Order Status Error:", error);
    res.status(500).json({ message: "Server error updating status" });
  }
}

/**
 * Downloads a generated Invoice PDF.
 */
export async function downloadInvoice(req, res) {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Admins can view any; users can only view their own
    if (req.user.role !== "admin" && order.user_id !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const invoiceRecord = await Invoice.findOne({ orderId: order._id });
    const invoiceNum = invoiceRecord ? invoiceRecord.invoiceNumber : "INV-GENERIC";

    const pdfBuffer = await generateInvoicePdf(order, invoiceNum);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice_${order._id.toString().slice(0, 8).toUpperCase()}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("[Order Controller] Download Invoice Error:", error);
    res.status(500).json({ message: "Server error downloading invoice PDF" });
  }
}

/**
 * Fetches Delivery Tracking details for an order.
 */
export async function getOrderTracking(req, res) {
  const { id } = req.params;

  try {
    const tracking = await DeliveryTracking.findOne({ orderId: id });
    if (!tracking) {
      return res.status(404).json({ message: "Tracking details not found" });
    }
    res.status(200).json(tracking);
  } catch (error) {
    console.error("[Order Controller] Get Tracking Error:", error);
    res.status(500).json({ message: "Server error fetching delivery details" });
  }
}
