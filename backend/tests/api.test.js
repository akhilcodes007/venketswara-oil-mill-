import mongoose from "mongoose";
import dotenv from "dotenv";

// 1. MOCK MONGOOSE CONNECTION AT THE VERY TOP
mongoose.connect = async () => {
  console.log("[Mock Database] Connected to Virtual DB");
  return {
    connection: mongoose.connection,
  };
};
mongoose.disconnect = async () => {
  console.log("[Mock Database] Disconnected");
};
Object.defineProperty(mongoose, "connection", {
  value: {
    host: "localhost",
    close: async () => {},
    readyState: 1,
    on: () => {},
    once: () => {},
  },
  writable: true,
  configurable: true,
});

// Import Models AFTER mocking mongoose connection
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";
import Coupon from "../models/Coupon.js";
import Payment from "../models/Payment.js";
import Notification from "../models/Notification.js";
import ShippingAddress from "../models/ShippingAddress.js";
import DeliveryTracking from "../models/DeliveryTracking.js";
import Invoice from "../models/Invoice.js";

// 2. VIRTUAL IN-MEMORY DB STORE
const db = {
  users: [],
  otps: [],
  products: [
    {
      id: "groundnut-oil",
      slug: "groundnut-oil",
      name: "Groundnut Oil",
      category: "oils",
      description: "Cold-pressed oil",
      variants: [{ size: "1 Litre", price: 240 }],
      tags: ["Best Seller"],
      stock: 50,
      enabled: true,
      rating: 5,
    },
    {
      id: "sesame-oil",
      slug: "sesame-oil",
      name: "Sesame Oil",
      category: "oils",
      description: "Sesame oil",
      variants: [{ size: "1 Litre", price: 370 }],
      tags: ["Popular"],
      stock: 45,
      enabled: true,
      rating: 5,
    }
  ],
  orders: [],
  reviews: [],
  carts: [],
  wishlists: [],
  coupons: [
    { code: "SVOM10", discountPct: 10, isActive: true },
  ],
  payments: [],
  notifications: [],
  addresses: [],
  trackings: [],
  invoices: [],
};

// 3. MOCK MONGOOSE STATIC METHODS
function mockModel(Model, dbArrayName) {
  Model.find = function(query = {}) {
    let list = [...db[dbArrayName]];
    if (query.category && query.category !== "all") {
      list = list.filter((x) => x.category === query.category);
    }
    if (query.user_id) {
      list = list.filter((x) => x.user_id === query.user_id.toString());
    }
    if (query.product_id) {
      list = list.filter((x) => x.product_id === query.product_id);
    }

    const queryChain = {
      sort: function(sortOption) {
        if (sortOption && sortOption.createdAt) {
          list.sort((a, b) => {
            const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return sortOption.createdAt === -1 ? db - da : da - db;
          });
        }
        return this;
      },
      skip: function(n) {
        list = list.slice(n);
        return this;
      },
      limit: function(n) {
        list = list.slice(0, n);
        return this;
      },
      then: function(resolve, reject) {
        resolve(list);
      }
    };
    return queryChain;
  };

  Model.findOne = async function(query = {}) {
    if (query.email) {
      return db[dbArrayName].find((x) => x.email === query.email);
    }
    if (query.id) {
      return db[dbArrayName].find((x) => x.id === query.id);
    }
    if (query.code) {
      return db[dbArrayName].find((x) => x.code === query.code);
    }
    if (query.orderId) {
      return db[dbArrayName].find((x) => x.orderId && x.orderId.toString() === query.orderId.toString());
    }
    if (query._id) {
      return db[dbArrayName].find((x) => x._id.toString() === query._id.toString());
    }
    if (query.user_id) {
      return db[dbArrayName].find((x) => x.user_id === query.user_id.toString());
    }
    return db[dbArrayName][0] || null;
  };

  Model.findById = async function(id) {
    return db[dbArrayName].find((x) => x._id.toString() === id.toString());
  };

  Model.create = async function(data) {
    const doc = {
      _id: new mongoose.Types.ObjectId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function() {
        const idx = db[dbArrayName].findIndex((x) => x._id.toString() === this._id.toString());
        if (idx >= 0) db[dbArrayName][idx] = this;
        return this;
      },
    };
    db[dbArrayName].push(doc);
    return doc;
  };

  Model.findOneAndUpdate = async function(query, update, options = {}) {
    const doc = await Model.findOne(query);
    if (doc) {
      const u = update.$set || update;
      Object.keys(u).forEach((key) => {
        doc[key] = u[key];
      });
      if (update.$inc) {
        Object.keys(update.$inc).forEach((key) => {
          doc[key] = (doc[key] || 0) + update.$inc[key];
        });
      }
      return doc;
    }
    if (options.upsert) {
      return await Model.create({ ...query, ...(update.$set || update) });
    }
    return null;
  };

  Model.countDocuments = async function(query = {}) {
    const list = await Model.find(query);
    return list.length;
  };

  Model.deleteMany = async function() {
    db[dbArrayName] = [];
    return { deletedCount: 0 };
  };

  Model.deleteOne = async function(query) {
    const doc = await Model.findOne(query);
    if (doc) {
      db[dbArrayName] = db[dbArrayName].filter((x) => x._id.toString() !== doc._id.toString());
    }
    return { deletedCount: 1 };
  };

  Model.findOneAndDelete = async function(query) {
    const doc = await Model.findOne(query);
    if (doc) {
      db[dbArrayName] = db[dbArrayName].filter((x) => x._id.toString() !== doc._id.toString());
    }
    return doc;
  };
}

mockModel(User, "users");
mockModel(Otp, "otps");
mockModel(Product, "products");
mockModel(Order, "orders");
mockModel(Review, "reviews");
mockModel(Cart, "carts");
mockModel(Wishlist, "wishlists");
mockModel(Coupon, "coupons");
mockModel(Payment, "payments");
mockModel(Notification, "notifications");
mockModel(ShippingAddress, "addresses");
mockModel(DeliveryTracking, "trackings");
mockModel(Invoice, "invoices");

// Custom updateMany for Address default flag clears
ShippingAddress.updateMany = async function(query, update) {
  const list = db.addresses.filter((x) => x.user_id === query.user_id);
  list.forEach((x) => {
    x.isDefault = update.$set.isDefault;
  });
  return { matchedCount: list.length };
};

// Load Environment
dotenv.config();

process.env.PORT = 5001;
process.env.NODE_ENV = "test";

const BASE_URL = "http://localhost:5001";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
  console.log("\n==================================================");
  console.log("    STARTING VIRTUAL INTEGRATION TESTS FOR SVEM   ");
  console.log("==================================================\n");

  try {
    // 1. Launch Express
    console.log("[Test] Booting Express App server...");
    await import("../server.js");
    await sleep(2000); // Allow server binding to complete

    // Verify server health
    console.log("[Test] Checking server /health...");
    const healthRes = await fetch(`${BASE_URL}/health`);
    if (!healthRes.ok) throw new Error("Health check failed");
    console.log("✔ Server is up & running.");

    // 2. Query products and verify smart filters
    console.log("[Test] Testing Products retrieval & category sorting...");
    const productsRes = await fetch(`${BASE_URL}/api/products`);
    if (!productsRes.ok) throw new Error("Failed to load products list");
    const productsData = await productsRes.json();
    console.log(`✔ Loaded ${productsData.products.length} products.`);

    const oilsRes = await fetch(`${BASE_URL}/api/products?category=oils`);
    const oilsData = await oilsRes.json();
    if (oilsData.products.some((p) => p.category !== "oils")) {
      throw new Error("Category filter returned non-oil items");
    }
    console.log(`✔ Product filtering verified. Oils count: ${oilsData.products.length}`);

    // 3. Test OTP Login Flow
    console.log("[Test] Requesting OTP Code for shreedhana2005@gmail.com...");
    const testEmail = "shreedhana2005@gmail.com";
    const otpSendRes = await fetch(`${BASE_URL}/api/auth/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail }),
    });
    if (!otpSendRes.ok) throw new Error("OTP request failed");
    console.log("✔ OTP code request accepted.");

    // Get code from virtual DB
    const otpDoc = db.otps.find((x) => x.email === testEmail);
    if (!otpDoc) throw new Error("OTP was not saved in virtual database");
    console.log(`✔ Read OTP from virtual DB: ${otpDoc.code}`);

    // Verify OTP code and check role assignment
    console.log("[Test] Verifying code and obtaining token...");
    const verifyRes = await fetch(`${BASE_URL}/api/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, code: otpDoc.code }),
    });
    if (!verifyRes.ok) throw new Error("OTP verification failed");
    const verifyData = await verifyRes.json();
    const token = verifyData.accessToken;
    console.log(`✔ Sign in completed. Role: ${verifyData.user.role}. Token received.`);

    // 4. Test Cart Synchronization
    console.log("[Test] Syncing shopping cart items...");
    const cartItems = [
      { id: "groundnut-oil", name: "Groundnut Oil", size: "1 Litre", price: 240, qty: 1 },
    ];
    const saveCartRes = await fetch(`${BASE_URL}/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items: cartItems }),
    });
    if (!saveCartRes.ok) throw new Error("Failed to save cart");

    const getCartRes = await fetch(`${BASE_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const cartData = await getCartRes.json();
    if (cartData.items.length !== 1 || cartData.items[0].id !== "groundnut-oil") {
      throw new Error("Cart items are incorrect in DB");
    }
    console.log("✔ Shopping Cart persistence checks passed.");

    // 5. Test Coupon Checks
    console.log("[Test] Verifying coupon verification...");
    const couponRes = await fetch(`${BASE_URL}/api/coupons/SVOM10`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!couponRes.ok) throw new Error("Coupon code verification failed");
    const couponData = await couponRes.json();
    console.log(`✔ Coupon validated. Discount rate: ${couponData.discountPct}%`);

    // 6. Test Checkout Order Placement
    console.log("[Test] Placing an order...");
    const checkoutPayload = {
      customer_name: "Akhil SVOM",
      phone: "9876543210",
      email: testEmail,
      address: "12, Mill Road, Village Area, Tamil Nadu, 600001",
      items: cartItems,
      subtotal: 240,
      gst: 12,
      shipping: 60,
      discount: 24,
      total: 288,
      payment_method: "Cash on Delivery",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600001",
    };

    const orderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(checkoutPayload),
    });
    if (!orderRes.ok) {
      const err = await orderRes.json();
      throw new Error(`Order checkout failed: ${err.message}`);
    }
    const orderData = await orderRes.json();
    const orderId = orderData.orderId;
    console.log(`✔ Order created. Order ID: ${orderId}`);

    // 7. Verify Invoices PDF kit rendering
    console.log("[Test] Downloading dynamically generated Invoice PDF receipt...");
    const invoiceRes = await fetch(`${BASE_URL}/api/orders/${orderId}/invoice`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!invoiceRes.ok) throw new Error("Invoice PDF generation failed");
    const arrayBuffer = await invoiceRes.arrayBuffer();
    console.log(`✔ PDF Receipt downloaded successfully (${arrayBuffer.byteLength} bytes).`);

    // 8. Verify Admin Statistics API
    console.log("[Test] Fetching Admin Dashboard metrics...");
    const adminRes = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!adminRes.ok) throw new Error("Failed to load dashboard metrics");
    const adminData = await adminRes.json();
    console.log(`✔ Dashboard KPIs generated. Total revenue: ₹${adminData.stats.totalRevenue}`);

    console.log("\n==================================================");
    console.log("       ALL INTEGRATION TESTS PASSED SUCCESSFULLY   ");
    console.log("==================================================\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ TESTS FAILED:", error.message);
    process.exit(1);
  }
}

runTests();
