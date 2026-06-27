import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import User from "../models/User.js";

dotenv.config({ path: "../.env" }); // Load env variables from parent directory if needed, or local

const seedProducts = [
  {
    id: "groundnut-oil",
    slug: "groundnut-oil",
    name: "Groundnut Oil",
    category: "oils",
    description: "Traditional cold-pressed groundnut oil extracted without chemicals. Rich in antioxidants and perfect for everyday cooking.",
    image: "https://i.ibb.co/tM14KvL4/Chat-GPT-Image-Jun-24-2026-03-53-07-PM.png",
    variants: [
      { size: "500 ml", price: 120 },
      { size: "1 Litre", price: 240 },
    ],
    tags: ["Best Seller"],
    stock: 50,
  },
  {
    id: "sesame-oil",
    slug: "sesame-oil",
    name: "Sesame Oil",
    category: "oils",
    description: "Wood-pressed sesame oil rich in calcium, vitamins and healthy fats. Ideal for cooking and traditional uses.",
    image: "https://i.ibb.co/bMdwm3v9/Image-1-1.webp",
    variants: [
      { size: "500 ml", price: 190 },
      { size: "1 Litre", price: 370 },
    ],
    tags: ["Popular"],
    stock: 45,
  },
  {
    id: "coconut-oil",
    slug: "coconut-oil",
    name: "Coconut Oil",
    category: "oils",
    description: "Pure cold-pressed coconut oil from fresh coconuts. Excellent for cooking, skin care and hair care.",
    image: "https://i.ibb.co/pBSC9w8t/Chat-GPT-Image-Jun-24-2026-07-00-57-PM.png",
    variants: [
      { size: "500 ml", price: 200 },
      { size: "1 Litre", price: 390 },
    ],
    tags: ["New"],
    stock: 30,
  },
  {
    id: "castor-oil",
    slug: "castor-oil",
    name: "Castor Oil",
    category: "oils",
    description: "Natural castor oil known for hair growth and medicinal benefits.",
    image: "https://i.ibb.co/7d71yWkt/Chat-GPT-Image-Jun-25-2026-10-17-30-AM.png",
    variants: [
      { size: "250 ml", price: 90 },
    ],
    tags: [],
    stock: 25,
  },
  {
    id: "mustard-oil",
    slug: "mustard-oil",
    name: "Mustard Oil",
    category: "oils",
    description: "Traditional mustard oil rich in omega fatty acids with natural flavour.",
    image: "https://i.ibb.co/cS2NX06C/Chat-GPT-Image-Jun-25-2026-06-43-30-PM.png",
    variants: [
      { size: "250 ml", price: 75 },
    ],
    tags: [],
    stock: 40,
  },
  {
    id: "neem-oil",
    slug: "neem-oil",
    name: "Neem Oil",
    category: "oils",
    description: "100% pure neem oil for agricultural and external applications.",
    image: "https://i.ibb.co/tw2NqHCD/Chat-GPT-Image-Jun-25-2026-06-35-55-PM.png",
    variants: [
      { size: "250 ml", price: 100 },
    ],
    tags: [],
    stock: 15,
  },
  {
    id: "deepam-oil",
    slug: "deepam-oil",
    name: "Deepam Oil",
    category: "oils",
    description: "Traditional deepam oil for ritual and everyday uses, made with care for ceremonial lighting.",
    image: "https://i.ibb.co/gZY8TM8M/remove-the-seed-image-Rb-Pawaz-UU9af-YNMe3-YWSAQ-6-MX-3-SXc-R7-Oh-UVXltqoteg.jpg",
    variants: [
      { size: "500 ml", price: 110 },
      { size: "1 Litre", price: 220 },
    ],
    tags: [],
    stock: 60,
  },
  // Dry fruits
  {
    id: "almonds",
    slug: "almonds",
    name: "Almonds",
    category: "dryfruits",
    description: "Premium quality almonds, hand-picked and freshly packed.",
    image: "https://i.ibb.co/1gw6BQv/Chat-GPT-Image-Jun-25-2026-06-33-11-PM.png",
    variants: [
      { size: "250 g", price: 300 },
      { size: "500 g", price: 600 },
      { size: "1 Kg", price: 1200 },
    ],
    tags: [],
    stock: 80,
  },
  {
    id: "cashews",
    slug: "cashews",
    name: "Cashews",
    category: "dryfruits",
    description: "Premium quality cashews, hand-picked and freshly packed.",
    image: "https://i.ibb.co/wZjQYNYN/Chat-GPT-Image-Jun-25-2026-06-37-36-PM.png",
    variants: [
      { size: "250 g", price: 300 },
      { size: "500 g", price: 600 },
      { size: "1 Kg", price: 1200 },
    ],
    tags: [],
    stock: 75,
  },
  {
    id: "salted-pistachios",
    slug: "salted-pistachios",
    name: "Salted Pistachios",
    category: "dryfruits",
    description: "Premium quality salted pistachios, hand-picked and freshly packed.",
    image: "https://i.ibb.co/VWV66LZp/Chat-GPT-Image-Jun-25-2026-06-42-56-PM.png",
    variants: [
      { size: "250 g", price: 425 },
      { size: "500 g", price: 850 },
      { size: "1 Kg", price: 1700 },
    ],
    tags: [],
    stock: 35,
  },
  {
    id: "palm-sugar",
    slug: "palm-sugar",
    name: "Palm Sugar",
    category: "palm-products",
    description: "Natural palm sugar made from fresh palm sap. A healthy alternative to refined sugar with a rich caramel-like taste.",
    image: "https://i.ibb.co/jKmvr1m/Chat-GPT-Image-Jun-25-2026-06-23-52-PM.png",
    variants: [
      { size: "500 g", price: 45 },
      { size: "1 Kg", price: 90 },
    ],
    tags: [],
    stock: 120,
  },
  {
    id: "palm-jaggery",
    slug: "palm-jaggery",
    name: "Palm Jaggery",
    category: "palm-products",
    description: "Traditional palm jaggery made without chemicals or preservatives. Rich in minerals and natural sweetness.",
    image: "https://i.ibb.co/23X07p4G/Chat-GPT-Image-Jun-25-2026-06-14-43-PM.png",
    variants: [
      { size: "500 g", price: 240 },
      { size: "1 Kg", price: 480 },
    ],
    tags: [],
    stock: 45,
  },
  {
    id: "varagu",
    slug: "varagu",
    name: "Varagu",
    tamilName: "வரகு",
    category: "millets",
    description: "A highly nutritious traditional millet rich in fiber and essential minerals. Suitable for healthy meals and diabetic-friendly diets.",
    image: "https://i.ibb.co/dsQkCmpb/varagu.png",
    variants: [
      { size: "500 g", price: 75 },
      { size: "1 Kg", price: 150 },
    ],
    tags: ["Millets"],
    stock: 48,
    rating: 4.7,
  },
  {
    id: "saamai",
    slug: "saamai",
    name: "Saamai",
    tamilName: "சாமை",
    category: "millets",
    description: "Light, easy to digest, and naturally rich in nutrients. Ideal for porridge, upma, and everyday healthy cooking.",
    image: "https://i.ibb.co/mFbdCP6T/saamai.png",
    variants: [
      { size: "500 g", price: 70 },
      { size: "1 Kg", price: 130 },
    ],
    tags: ["Millets"],
    stock: 52,
    rating: 4.6,
  },
  {
    id: "kuthiraivali",
    slug: "kuthiraivali",
    name: "Kuthiraivali",
    tamilName: "குதிரைவாலி",
    category: "millets",
    description: "A wholesome millet with a low glycemic index and high fiber content. Perfect for weight-conscious and health-focused diets.",
    image: "https://i.ibb.co/nqSyM3pD/kuthiraivali.png",
    variants: [
      { size: "500 g", price: 75 },
      { size: "1 Kg", price: 150 },
    ],
    tags: ["Millets"],
    stock: 40,
    rating: 4.8,
  },
  {
    id: "thinai",
    slug: "thinai",
    name: "Thinai",
    tamilName: "திணை",
    category: "millets",
    description: "An ancient millet rich in protein, iron, and dietary fiber. Excellent for both traditional and modern healthy recipes.",
    image: "https://i.ibb.co/v61R0fBS/thinai.png",
    variants: [
      { size: "500 g", price: 60 },
      { size: "1 Kg", price: 120 },
    ],
    tags: ["Millets"],
    stock: 36,
    rating: 4.7,
  },
  {
    id: "malai-then",
    slug: "malai-then",
    name: "Malai Then",
    tamilName: "மலைத் தேன்",
    category: "honey",
    description: "Pure natural hill honey collected from bees in forest and mountain regions. Naturally rich in enzymes, antioxidants, vitamins, and minerals.",
    image: "https://i.ibb.co/7QC8b2x/honey-jar-2.jpg",
    variants: [
      { size: "250 g", price: 400 },
      { size: "500 g", price: 800 },
    ],
    tags: ["Premium"],
    stock: 14,
    rating: 4.9,
  },
];

export async function seedDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/svem";
  
  try {
    // If not connected already
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
    }
    
    console.log("[Seeder] Starting DB check...");

    // 1. Seed Products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(seedProducts);
      console.log(`[Seeder] Seeded ${seedProducts.length} default products.`);
    } else {
      console.log(`[Seeder] Products collection already populated (${productCount} items).`);
    }

    // 2. Seed Coupon SVOM10 if empty
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      await Coupon.create({
        code: "SVOM10",
        discountPct: 10,
        isActive: true,
      });
      console.log("[Seeder] Seeded default coupon SVOM10 (10% off).");
    } else {
      console.log(`[Seeder] Coupon collection already populated.`);
    }

    // 3. Seed Admin profile if empty
    const adminEmail = process.env.ADMIN_EMAIL || "shreedhana2005@gmail.com";
    const adminUser = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!adminUser) {
      await User.create({
        email: adminEmail.toLowerCase(),
        role: "admin",
      });
      console.log(`[Seeder] Seeded Admin profile for email: ${adminEmail}`);
    } else {
      console.log(`[Seeder] Admin user already exists.`);
    }

    console.log("[Seeder] Database checks completed.");
  } catch (error) {
    console.error("[Seeder] Database seeding failed:", error);
  }
}

// Running script directly via terminal command
if (process.argv[1] && process.argv[1].endsWith("seed.js")) {
  seedDB().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}
