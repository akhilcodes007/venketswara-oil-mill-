import crypto from 'crypto';
import razorpay, { isSimulator } from '../config/razorpay.js';
import supabase from '../config/supabase.js';
import { emitNotification } from '../sockets/index.js';

export async function createRazorpayOrder(req, res) {
  const { orderId } = req.body;

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const rpOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100), // Paise
      currency: 'INR',
      receipt: `receipt_${order.id.slice(0, 8)}`,
      notes: { orderId: order.id, customerName: order.customer_name },
    });

    res.status(200).json(rpOrder);
  } catch (error) {
    console.error('[Payment] createRazorpayOrder error:', error);
    res.status(500).json({ message: 'Error creating payment order' });
  }
}

export async function verifyPayment(req, res) {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify HMAC signature
    let isValid = false;
    if (isSimulator) {
      isValid = true;
      console.log('[Payment Simulator] Mock payment verified for order', orderId);
    } else {
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSig = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');
      isValid = expectedSig === razorpay_signature;
    }

    if (!isValid) {
      // Log failed payment
      await supabase.from('payments').insert({
        user_id: order.user_id,
        order_id: order.id,
        customer_name: order.customer_name,
        payment_method: order.payment_method,
        amount: order.total,
        status: 'failed',
        razorpay_order_id,
        razorpay_payment_id,
      });

      await supabase
        .from('orders')
        .update({ status: 'confirmed' })
        .eq('id', orderId);

      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Log successful payment
    const { data: paymentLog } = await supabase
      .from('payments')
      .insert({
        user_id: order.user_id,
        order_id: order.id,
        customer_name: order.customer_name,
        payment_method: order.payment_method,
        amount: order.total,
        status: 'completed',
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        location: order.address?.split(',').slice(-2).join(',').trim() || '',
      })
      .select()
      .single();

    // Admin notification
    await supabase.from('notifications').insert({
      message: `Payment of ₹${order.total} received from ${order.customer_name} for order #${orderId.slice(0, 8).toUpperCase()}`,
      type: 'payment',
    });

    emitNotification('admin', 'payment', {
      paymentId: paymentLog?.id,
      orderId,
      customerName: order.customer_name,
      amount: order.total,
    });

    if (order.user_id) {
      emitNotification(order.user_id, 'payment_status', {
        orderId,
        status: 'completed',
        message: 'Your payment was processed successfully!',
      });
    }

    res.status(200).json({ message: 'Payment verified successfully' });
  } catch (error) {
    console.error('[Payment] verifyPayment error:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
}

export async function getPaymentHistory(req, res) {
  try {
    let query = supabase.from('payments').select('*').order('created_at', { ascending: false });
    const { data, error } = await query;
    if (error) throw error;
    res.status(200).json(data || []);
  } catch (error) {
    console.error('[Payment] getPaymentHistory error:', error);
    res.status(500).json({ message: 'Error fetching payment history' });
  }
}
