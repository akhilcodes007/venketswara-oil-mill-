import supabase from '../config/supabase.js';

export async function getDashboardStats(req, res) {
  try {
    // Fetch all orders
    const { data: orders, error: ordersErr } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersErr) throw ordersErr;

    const allOrders = orders || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Aggregate stats
    let totalRevenue = 0;
    let monthlyRevenue = 0;
    const dailySalesMap = new Map();
    const productStatsMap = new Map();

    allOrders.forEach((o) => {
      const orderDate = new Date(o.created_at);
      totalRevenue += o.total;

      if (orderDate >= startOfMonth) monthlyRevenue += o.total;

      if (orderDate >= thirtyDaysAgo) {
        const key = orderDate.toISOString().split('T')[0];
        dailySalesMap.set(key, (dailySalesMap.get(key) || 0) + o.total);
      }

      const items = Array.isArray(o.items) ? o.items : [];
      items.forEach((item) => {
        const cur = productStatsMap.get(item.id) || { name: item.name, units: 0, revenue: 0 };
        cur.units += item.qty;
        cur.revenue += item.qty * item.price;
        productStatsMap.set(item.id, cur);
      });
    });

    // Low stock products
    const { data: lowStock } = await supabase
      .from('products')
      .select('id, name, stock, category')
      .lte('stock', 5)
      .eq('enabled', true)
      .limit(10);

    // Counts
    const totalOrders = allOrders.length;
    const todayOrders = allOrders.filter((o) => new Date(o.created_at) >= today).length;
    const pendingOrders = allOrders.filter((o) => ['confirmed', 'packed', 'shipped', 'out_for_delivery'].includes(o.status)).length;
    const cancelledOrders = allOrders.filter((o) => o.status === 'cancelled').length;

    const dailySales = Array.from(dailySalesMap.entries())
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const productPerformance = Array.from(productStatsMap.entries())
      .map(([productId, info]) => ({ productId, ...info }))
      .sort((a, b) => b.units - a.units);

    res.status(200).json({
      stats: {
        totalOrders,
        todayOrders,
        totalRevenue,
        monthlyRevenue,
        pendingOrders,
        cancelledOrders,
        lowStockCount: (lowStock || []).length,
      },
      charts: { dailySales, productPerformance },
      recentOrders: allOrders.slice(0, 5),
      lowStockProducts: lowStock || [],
    });
  } catch (error) {
    console.error('[Admin] getDashboardStats error:', error);
    res.status(500).json({ message: 'Error calculating dashboard stats' });
  }
}

export async function getCustomers(req, res) {
  try {
    // Get all users with customer role
    const { data: roles, error } = await supabase
      .from('user_roles')
      .select('user_id, role, created_at')
      .eq('role', 'customer')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const customers = [];
    for (const roleEntry of (roles || [])) {
      const { data: userOrders } = await supabase
        .from('orders')
        .select('id, total, status, created_at, phone, address')
        .eq('user_id', roleEntry.user_id)
        .order('created_at', { ascending: false });

      const orders = userOrders || [];
      const totalSpend = orders.reduce((s, o) => s + o.total, 0);

      // Get auth user details via admin API
      const { data: authUser } = await supabase.auth.admin.getUserById(roleEntry.user_id);

      customers.push({
        id: roleEntry.user_id,
        email: authUser?.user?.email || 'N/A',
        phone: orders[0]?.phone || 'N/A',
        address: orders[0]?.address || 'No address',
        joinedAt: roleEntry.created_at,
        totalOrders: orders.length,
        totalSpend,
        orderHistory: orders.map((o) => ({
          orderId: o.id,
          total: o.total,
          status: o.status,
          date: o.created_at,
        })),
      });
    }

    res.status(200).json(customers);
  } catch (error) {
    console.error('[Admin] getCustomers error:', error);
    res.status(500).json({ message: 'Error fetching customers' });
  }
}

export async function toggleBlockCustomer(req, res) {
  const { id } = req.params;
  const { isBlocked } = req.body;

  try {
    // Supabase Admin: ban/unban user
    const { error } = isBlocked
      ? await supabase.auth.admin.updateUserById(id, { ban_duration: '87600h' }) // 10 years
      : await supabase.auth.admin.updateUserById(id, { ban_duration: 'none' });

    if (error) throw error;

    res.status(200).json({
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
    });
  } catch (error) {
    console.error('[Admin] toggleBlockCustomer error:', error);
    res.status(500).json({ message: 'Error updating user block status' });
  }
}

export async function getDeliveryList(req, res) {
  try {
    const { data, error } = await supabase
      .from('delivery_tracking')
      .select('*, orders(customer_name, phone, address, total)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data || []);
  } catch (error) {
    console.error('[Admin] getDeliveryList error:', error);
    res.status(500).json({ message: 'Error fetching delivery list' });
  }
}

export async function updateDelivery(req, res) {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('delivery_tracking')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ message: 'Delivery record not found' });
    res.status(200).json(data);
  } catch (error) {
    console.error('[Admin] updateDelivery error:', error);
    res.status(500).json({ message: 'Error updating delivery' });
  }
}
