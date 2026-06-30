import supabase from '../config/supabase.js';
import { generateInvoicePdf } from '../services/pdfService.js';
import { sendInvoiceEmail, sendOrderStatusEmail } from '../services/emailService.js';
import { sendSmsNotification, sendWhatsAppNotification } from '../services/smsService.js';
import { emitNotification } from '../sockets/index.js';

export async function createOrder(req, res) {
  const {
    customer_name, phone, email, address,
    items, subtotal, gst, shipping, discount, total,
    coupon, payment_method,
  } = req.body;

  const userId = req.user?.id || null;
  const userEmail = req.user?.email || email;

  try {
    // 1. Create order in Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        customer_name,
        phone,
        email: userEmail,
        address,
        items,
        subtotal,
        gst,
        shipping,
        discount: discount || 0,
        total,
        coupon: coupon || null,
        payment_method,
        status: 'confirmed',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Deduct stock for each item and check low stock
    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('stock, name')
        .eq('id', item.id)
        .single();

      if (product && product.stock !== null) {
        const newStock = Math.max(0, product.stock - item.qty);
        await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.id);

        // Low stock alert (≤5 units)
        if (newStock <= 5) {
          await supabase.from('notifications').insert({
            message: `Low stock: Only ${newStock} left for ${product.name}`,
            type: 'low_stock',
          });
          emitNotification('admin', 'low_stock', {
            productId: item.id,
            name: product.name,
            stock: newStock,
          });
        }
      }
    }

    // 3. Generate invoice number and PDF
    const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const pdfBuffer = await generateInvoicePdf(order, invoiceNumber);

    // 4. Save invoice record
    const { data: invoice } = await supabase
      .from('invoices')
      .insert({ order_id: order.id, invoice_number: invoiceNumber })
      .select()
      .single();

    // 5. Create delivery tracking
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

    await supabase.from('delivery_tracking').insert({
      order_id: order.id,
      status: 'confirmed',
      current_location: 'Mill Warehouse',
      estimated_delivery_date: estimatedDelivery.toISOString(),
      history: [{ status: 'confirmed', location: 'Mill Warehouse', timestamp: new Date().toISOString() }],
    });

    // 6. Email invoice (non-blocking)
    if (userEmail) {
      sendInvoiceEmail(userEmail, order, pdfBuffer).catch((err) =>
        console.error('[Order] Invoice email error:', err.message)
      );
    }

    // 7. SMS notification (non-blocking)
    const smsText = `Order Confirmed! #${order.id.slice(0, 8).toUpperCase()} for ₹${total}. Thank you - Sri Venkateshwara Oil Mill`;
    sendSmsNotification(phone, smsText).catch(() => {});
    sendWhatsAppNotification(phone, smsText).catch(() => {});

    // 8. Admin notification via Socket.io
    await supabase.from('notifications').insert({
      message: `New order #${order.id.slice(0, 8).toUpperCase()} from ${customer_name} - ₹${total}`,
      type: 'new_order',
    });

    emitNotification('admin', 'new_order', {
      orderId: order.id,
      customer_name,
      total,
      payment_method,
      itemsCount: items.length,
      created_at: order.created_at,
    });

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: order.id,
      invoiceNumber,
    });
  } catch (error) {
    console.error('[Order] createOrder error:', error);
    res.status(500).json({ message: 'Server error placing order' });
  }
}

export async function getOrders(req, res) {
  try {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

    // Customers see only their orders; admin sees all
    if (req.user.role !== 'admin') {
      query = query.eq('user_id', req.user.id);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.status(200).json(data || []);
  } catch (error) {
    console.error('[Order] getOrders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
}

export async function getOrderById(req, res) {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('[Order] getOrderById error:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
}

export async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const locationMap = {
    confirmed: 'Mill Warehouse',
    packed: 'Mill Warehouse',
    shipped: 'Transit Hub',
    out_for_delivery: 'Local Delivery Office',
    delivered: 'Customer Doorstep',
    cancelled: 'N/A',
  };

  const coordsMap = {
    confirmed: [77.5946, 12.9716],
    packed: [77.5950, 12.9720],
    shipped: [77.6300, 12.9400],
    out_for_delivery: [77.6100, 12.9500],
    delivered: [77.6000, 12.9600],
    cancelled: [77.5946, 12.9716],
  };

  try {
    // Get the order
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status
    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Update delivery tracking history
    const { data: tracking } = await supabase
      .from('delivery_tracking')
      .select('history')
      .eq('order_id', id)
      .single();

    const history = tracking?.history || [];
    history.push({
      status,
      location: locationMap[status] || 'Unknown',
      timestamp: new Date().toISOString(),
    });

    await supabase
      .from('delivery_tracking')
      .update({
        status,
        current_location: locationMap[status] || 'Unknown',
        coordinates: coordsMap[status] || null,
        history,
      })
      .eq('order_id', id);

    // Notify customer via Socket.io
    if (order.user_id) {
      emitNotification(order.user_id, 'order_update', {
        orderId: id,
        status,
        message: `Your order status is now: ${status.replace(/_/g, ' ')}`,
      });
    }

    // Send email notification
    if (order.email) {
      sendOrderStatusEmail(order.email, order.customer_name, id, status).catch(() => {});
    }

    // SMS update
    const smsText = `Order #${id.slice(0, 8).toUpperCase()} is now ${status.toUpperCase().replace(/_/g, ' ')} - Sri Venkateshwara Oil Mill`;
    sendSmsNotification(order.phone, smsText).catch(() => {});

    res.status(200).json({ message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    console.error('[Order] updateOrderStatus error:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
}

export async function downloadInvoice(req, res) {
  const { id } = req.params;

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { data: invoiceRecord } = await supabase
      .from('invoices')
      .select('invoice_number')
      .eq('order_id', id)
      .single();

    const invoiceNumber = invoiceRecord?.invoice_number || `INV-${id.slice(0, 8).toUpperCase()}`;
    const pdfBuffer = await generateInvoicePdf(order, invoiceNumber);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${id.slice(0, 8).toUpperCase()}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('[Order] downloadInvoice error:', error);
    res.status(500).json({ message: 'Error generating invoice' });
  }
}

export async function getOrderTracking(req, res) {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('delivery_tracking')
      .select('*')
      .eq('order_id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Tracking info not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error('[Order] getOrderTracking error:', error);
    res.status(500).json({ message: 'Error fetching tracking' });
  }
}
