import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

/**
 * Aggregates statistics for the Admin Dashboard metrics and charts.
 */
export async function getDashboardStats(req, res) {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const lowStockProductsCount = await Product.countDocuments({ stock: { $lte: 5 } });

    // Pending Orders count (anything not delivered/cancelled)
    const pendingOrders = await Order.countDocuments({
      status: { $in: ["confirmed", "packed", "shipped", "out_for_delivery"] },
    });

    // Cancelled Orders (status is cancelled)
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

    // Today's Orders
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayOrdersCount = await Order.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    // Revenue aggregations
    const allOrders = await Order.find();
    
    let totalRevenue = 0;
    let monthlyRevenue = 0;
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    allOrders.forEach((o) => {
      totalRevenue += o.total;
      if (new Date(o.createdAt) >= startOfMonth) {
        monthlyRevenue += o.total;
      }
    });

    // Daily Sales analytics (last 30 days)
    const dailySalesMap = new Map();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    allOrders.forEach((o) => {
      const orderDate = new Date(o.createdAt);
      if (orderDate >= thirtyDaysAgo) {
        const dateKey = orderDate.toISOString().split("T")[0];
        dailySalesMap.set(dateKey, (dailySalesMap.get(dateKey) || 0) + o.total);
      }
    });

    const dailySales = Array.from(dailySalesMap.entries()).map(([date, revenue]) => ({
      date,
      revenue,
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Product performance sales mix
    const productStatsMap = new Map();
    allOrders.forEach((o) => {
      o.items.forEach((item) => {
        const current = productStatsMap.get(item.id) || { name: item.name, units: 0, revenue: 0 };
        current.units += item.qty;
        current.revenue += item.qty * item.price;
        productStatsMap.set(item.id, current);
      });
    });

    const productPerformance = Array.from(productStatsMap.entries()).map(([id, info]) => ({
      productId: id,
      ...info,
    })).sort((a, b) => b.units - a.units);

    // List of 5 recent orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    // List of 5 recent customers
    const recentCustomers = await User.find({ role: "customer" }).sort({ createdAt: -1 }).limit(5);

    // Low stock product models list
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).limit(10);

    res.status(200).json({
      stats: {
        totalOrders,
        todayOrders: todayOrdersCount,
        monthlyRevenue,
        totalRevenue,
        totalCustomers,
        totalProducts,
        lowStockProducts: lowStockProductsCount,
        pendingOrders,
        cancelledOrders,
      },
      charts: {
        dailySales,
        productPerformance,
      },
      recentOrders,
      recentCustomers,
      lowStockProducts,
    });
  } catch (error) {
    console.error("[Admin Controller] Dashboard Stats Error:", error);
    res.status(500).json({ message: "Server error calculating stats" });
  }
}

/**
 * Gets all customers with total order count and aggregate spend.
 */
export async function getCustomers(req, res) {
  try {
    const users = await User.find({ role: "customer" }).sort({ createdAt: -1 });
    const customers = [];

    for (const u of users) {
      const orders = await Order.find({ user_id: u._id.toString() });
      const totalSpend = orders.reduce((sum, o) => sum + o.total, 0);

      // Find first phone/address from order history if available
      const latestOrder = orders[0];
      const phone = latestOrder ? latestOrder.phone : "No orders yet";
      const address = latestOrder ? latestOrder.address : "No address specified";

      customers.push({
        id: u._id,
        email: u.email,
        phone,
        address,
        isBlocked: u.isBlocked,
        createdAt: u.createdAt,
        totalOrders: orders.length,
        totalSpend,
        orderHistory: orders.map((o) => ({
          orderId: o._id,
          total: o.total,
          status: o.status,
          date: o.createdAt,
        })),
      });
    }

    res.status(200).json(customers);
  } catch (error) {
    console.error("[Admin Controller] Get Customers Error:", error);
    res.status(500).json({ message: "Server error compiling customer list" });
  }
}

/**
 * Blocks or unblocks a customer. Banned customers cannot generate login codes or request APIs.
 */
export async function toggleBlockCustomer(req, res) {
  const { id } = req.params;
  const { isBlocked } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = isBlocked;
    await user.save();

    res.status(200).json({
      message: `User account has been successfully ${isBlocked ? "blocked" : "unblocked"}`,
      user: {
        id: user._id,
        email: user.email,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error("[Admin Controller] Block Customer Error:", error);
    res.status(500).json({ message: "Server error updating block status" });
  }
}
