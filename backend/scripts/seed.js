import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const PRODUCTS = [
  {
    id: 'groundnut-oil',
    slug: 'groundnut-oil',
    name: 'Cold Pressed Groundnut Oil',
    tamil_name: 'கடலை எண்ணெய்',
    category: 'oils',
    description: 'Traditional wood-pressed groundnut oil, rich in natural flavour. Zero additives, cold-pressed using our century-old wooden press (chekku) to preserve all nutrients.',
    image: null,
    tags: ['Best Seller', 'Popular'],
    variants: [
      { size: '500 ml', price: 220 },
      { size: '1 Litre', price: 420 },
      { size: '2 Litres', price: 820 },
      { size: '5 Litres', price: 1950 },
    ],
    stock: 100,
    enabled: true,
    rating: 4.8,
  },
  {
    id: 'sesame-oil',
    slug: 'sesame-oil',
    name: 'Cold Pressed Sesame Oil',
    tamil_name: 'நல்லெண்ணெய்',
    category: 'oils',
    description: 'Pure sesame oil made from carefully selected sesame seeds. Known for its medicinal properties and distinctive nutty aroma. A staple in South Indian cooking.',
    image: null,
    tags: ['Popular', 'New'],
    variants: [
      { size: '200 ml', price: 180 },
      { size: '500 ml', price: 380 },
      { size: '1 Litre', price: 720 },
    ],
    stock: 80,
    enabled: true,
    rating: 4.9,
  },
  {
    id: 'coconut-oil',
    slug: 'coconut-oil',
    name: 'Cold Pressed Coconut Oil',
    tamil_name: 'தேங்காய் எண்ணெய்',
    category: 'oils',
    description: 'Fresh-pressed virgin coconut oil. Ideal for cooking, hair, and skin care. No refining, no bleaching — just pure coconut goodness.',
    image: null,
    tags: ['Popular'],
    variants: [
      { size: '200 ml', price: 160 },
      { size: '500 ml', price: 360 },
      { size: '1 Litre', price: 680 },
    ],
    stock: 60,
    enabled: true,
    rating: 4.7,
  },
  {
    id: 'castor-oil',
    slug: 'castor-oil',
    name: 'Cold Pressed Castor Oil',
    tamil_name: 'ஆமணக்கு எண்ணெய்',
    category: 'oils',
    description: 'Pure wood-pressed castor oil, traditionally used for hair growth, skin moisturizing and joint pain relief. No chemical processing.',
    image: null,
    tags: [],
    variants: [
      { size: '100 ml', price: 120 },
      { size: '250 ml', price: 260 },
      { size: '500 ml', price: 480 },
    ],
    stock: 50,
    enabled: true,
    rating: 4.6,
  },
  {
    id: 'mustard-oil',
    slug: 'mustard-oil',
    name: 'Cold Pressed Mustard Oil',
    tamil_name: 'கடுகு எண்ணெய்',
    category: 'oils',
    description: 'Pungent and flavourful mustard oil pressed from premium mustard seeds. Excellent for pickling, cooking and traditional massages.',
    image: null,
    tags: ['New'],
    variants: [
      { size: '500 ml', price: 200 },
      { size: '1 Litre', price: 380 },
    ],
    stock: 40,
    enabled: true,
    rating: 4.5,
  },
  {
    id: 'cashews',
    slug: 'cashews',
    name: 'Premium Whole Cashews',
    tamil_name: 'முந்திரி',
    category: 'dryfruits',
    description: 'Large W240 grade whole cashews, naturally dried and sorted. Creamy, buttery texture. Ideal for cooking, snacking and gifting.',
    image: null,
    tags: ['Best Seller', 'Premium'],
    variants: [
      { size: '250 g', price: 220 },
      { size: '500 g', price: 420 },
      { size: '1 kg', price: 820 },
    ],
    stock: 75,
    enabled: true,
    rating: 4.8,
  },
  {
    id: 'almonds',
    slug: 'almonds',
    name: 'Natural Almonds',
    tamil_name: 'பாதாம்',
    category: 'dryfruits',
    description: 'Premium quality whole almonds, packed with protein, healthy fats and Vitamin E. Sourced directly from farms.',
    image: null,
    tags: ['Popular'],
    variants: [
      { size: '250 g', price: 280 },
      { size: '500 g', price: 540 },
      { size: '1 kg', price: 1050 },
    ],
    stock: 60,
    enabled: true,
    rating: 4.7,
  },
  {
    id: 'palm-jaggery',
    slug: 'palm-jaggery',
    name: 'Palm Jaggery',
    tamil_name: 'பனை வெல்லம்',
    category: 'palm-products',
    description: 'Traditional palm jaggery from natural palm sap. Rich in iron and minerals. A healthier alternative to refined sugar, with a distinctive caramel-like flavour.',
    image: null,
    tags: ['Traditional', 'Popular'],
    variants: [
      { size: '250 g', price: 80 },
      { size: '500 g', price: 150 },
      { size: '1 kg', price: 280 },
    ],
    stock: 90,
    enabled: true,
    rating: 4.9,
  },
  {
    id: 'palm-sugar',
    slug: 'palm-sugar',
    name: 'Palm Sugar Crystals',
    tamil_name: 'பனை சர்க்கரை',
    category: 'palm-products',
    description: 'Fine palm sugar crystals made from pure palm flower nectar. Low glycaemic index, natural sweetener perfect for diabetics and health-conscious consumers.',
    image: null,
    tags: ['New', 'Healthy'],
    variants: [
      { size: '250 g', price: 90 },
      { size: '500 g', price: 170 },
    ],
    stock: 70,
    enabled: true,
    rating: 4.6,
  },
  {
    id: 'forest-honey',
    slug: 'forest-honey',
    name: 'Pure Forest Honey',
    tamil_name: 'காட்டு தேன்',
    category: 'honey',
    description: 'Raw, unprocessed honey collected from wild forest beehives in Tamil Nadu. Natural, thick, full of enzymes and antioxidants. No heat treatment, no additives.',
    image: null,
    tags: ['Premium', 'Best Seller'],
    variants: [
      { size: '250 g', price: 280 },
      { size: '500 g', price: 520 },
      { size: '1 kg', price: 980 },
    ],
    stock: 45,
    enabled: true,
    rating: 5.0,
  },
  {
    id: 'little-millet',
    slug: 'little-millet',
    name: 'Little Millet (Samai)',
    tamil_name: 'சாமை',
    category: 'millets',
    description: 'Traditional samai millet, a nutritious ancient grain. High fibre, gluten-free, excellent for making traditional South Indian dishes like pongal and idli.',
    image: null,
    tags: ['Healthy', 'Traditional'],
    variants: [
      { size: '500 g', price: 85 },
      { size: '1 kg', price: 155 },
      { size: '5 kg', price: 720 },
    ],
    stock: 120,
    enabled: true,
    rating: 4.7,
  },
  {
    id: 'foxtail-millet',
    slug: 'foxtail-millet',
    name: 'Foxtail Millet (Thinai)',
    tamil_name: 'தினை',
    category: 'millets',
    description: 'Ancient thinai millet, packed with dietary fibre and minerals. A traditional Tamil Nadu crop cultivated for over 5000 years. Ideal for diabetic diets.',
    image: null,
    tags: ['Healthy', 'New'],
    variants: [
      { size: '500 g', price: 90 },
      { size: '1 kg', price: 165 },
    ],
    stock: 100,
    enabled: true,
    rating: 4.6,
  },
];

export async function seedDB() {
  if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder')) {
    console.log('[Seed] Supabase URL not configured, skipping seed.');
    return;
  }

  try {
    console.log('[Seed] Starting database seed...');

    // Seed products (upsert — safe to re-run)
    let seeded = 0;
    for (const product of PRODUCTS) {
      const { error } = await supabase
        .from('products')
        .upsert(product, { onConflict: 'id', ignoreDuplicates: false });

      if (error) {
        console.error(`[Seed] Error seeding product ${product.id}:`, error.message);
      } else {
        seeded++;
      }
    }
    console.log(`[Seed] ✅ Seeded ${seeded}/${PRODUCTS.length} products`);

    // Seed default coupon
    const { error: couponErr } = await supabase
      .from('coupons')
      .upsert({ code: 'SVOM10', discount_pct: 10, enabled: true }, { onConflict: 'code' });

    if (!couponErr) {
      console.log('[Seed] ✅ Coupon SVOM10 ready');
    }

    console.log('[Seed] 🌱 Database seeding complete!');
  } catch (err) {
    console.error('[Seed] Seed failed:', err.message);
  }
}

// Run directly: node scripts/seed.js
if (process.argv[1].endsWith('seed.js')) {
  seedDB().then(() => process.exit(0)).catch(() => process.exit(1));
}
