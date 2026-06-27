import mongoose from "mongoose";

// In-Memory Virtual Database Store
const db = {
  users: [
    {
      _id: new mongoose.Types.ObjectId(),
      email: "shreedhana2005@gmail.com",
      role: "admin",
      isBlocked: false,
      createdAt: new Date(),
    }
  ],
  otps: [],
  products: [
    {
      _id: new mongoose.Types.ObjectId(),
      id: "groundnut-oil",
      slug: "groundnut-oil",
      name: "Groundnut Oil",
      category: "oils",
      description: "Traditional cold-pressed groundnut oil, rich in nutrients and natural aroma.",
      variants: [
        { size: "500ml", price: 130 },
        { size: "1 Litre", price: 250 },
        { size: "5 Litre", price: 1200 }
      ],
      images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop"],
      tags: ["Best Seller", "100% Organic"],
      stock: 50,
      enabled: true,
      rating: 5,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      id: "coconut-oil",
      slug: "coconut-oil",
      name: "Coconut Oil",
      category: "oils",
      description: "Pure cold-pressed coconut oil extracted from fresh sun-dried copra.",
      variants: [
        { size: "500ml", price: 150 },
        { size: "1 Litre", price: 290 }
      ],
      images: ["https://images.unsplash.com/photo-1543164904-8fa92bf7b7e5?w=500&auto=format&fit=crop"],
      tags: ["Popular"],
      stock: 40,
      enabled: true,
      rating: 4.8,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      id: "sesame-oil",
      slug: "sesame-oil",
      name: "Sesame Oil",
      category: "oils",
      description: "Cold-pressed sesame (gingelly) oil made with palm jaggery.",
      variants: [
        { size: "500ml", price: 190 },
        { size: "1 Litre", price: 370 }
      ],
      images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop"],
      tags: ["Traditional"],
      stock: 35,
      enabled: true,
      rating: 5,
    }
  ],
  orders: [],
  reviews: [],
  carts: [],
  wishlists: [],
  coupons: [
    {
      _id: new mongoose.Types.ObjectId(),
      code: "SVOM10",
      discountPct: 10,
      isActive: true,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  ],
  payments: [],
  notifications: [],
  addresses: [],
  trackings: [],
  invoices: [],
};

// Stub function to mock models
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
      const match = db[dbArrayName].find((x) => x.code && x.code.toLowerCase() === query.code.toLowerCase());
      return match || null;
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
    if (!id) return null;
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

export function initDbMock() {
  // Import models dynamically to mock them
  const models = [
    { name: "User", array: "users" },
    { name: "Otp", array: "otps" },
    { name: "Product", array: "products" },
    { name: "Order", array: "orders" },
    { name: "Review", array: "reviews" },
    { name: "Cart", array: "carts" },
    { name: "Wishlist", array: "wishlists" },
    { name: "Coupon", array: "coupons" },
    { name: "Payment", array: "payments" },
    { name: "Notification", array: "notifications" },
    { name: "ShippingAddress", array: "addresses" },
    { name: "DeliveryTracking", array: "trackings" },
    { name: "Invoice", array: "invoices" },
  ];

  models.forEach((m) => {
    try {
      const Model = mongoose.model(m.name);
      mockModel(Model, m.array);
    } catch (e) {
      console.error(`[Mock DB] Failed to mock model ${m.name}:`, e.message);
    }
  });

  // Custom mock updateMany for default addresses
  try {
    const ShippingAddress = mongoose.model("ShippingAddress");
    ShippingAddress.updateMany = async function(query, update) {
      const list = db.addresses.filter((x) => x.user_id === query.user_id);
      list.forEach((x) => {
        x.isDefault = update.$set.isDefault;
      });
      return { matchedCount: list.length };
    };
  } catch {}

  console.log(`[Mock DB] Mongoose models stubbed successfully in memory.`);
}
