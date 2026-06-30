import supabase from '../config/supabase.js';
import { uploadToCloudinary } from '../middleware/upload.js';

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with filtering, sorting, search and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [featured, price-asc, price-desc, name, newest]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of products
 */
export async function getProducts(req, res) {
  const { category, search, sort, tag, page = 1, limit = 20 } = req.query;

  try {
    let query = supabase.from('products').select('*').eq('enabled', true);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (tag) {
      query = query.contains('tags', [tag]);
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%,tamil_name.ilike.%${search}%`
      );
    }

    const { data: allProducts, error } = await query;

    if (error) throw error;

    let products = allProducts || [];

    // Sorting
    if (sort === 'price-asc') {
      products.sort((a, b) => (a.variants?.[0]?.price || 0) - (b.variants?.[0]?.price || 0));
    } else if (sort === 'price-desc') {
      products.sort((a, b) => (b.variants?.[0]?.price || 0) - (a.variants?.[0]?.price || 0));
    } else if (sort === 'name') {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'newest') {
      products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    // Pagination
    const total = products.length;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const start = (pageNum - 1) * limitNum;
    const paginated = products.slice(start, start + limitNum);

    res.status(200).json({
      products: paginated,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    console.error('[Product] getProducts error:', error);
    res.status(500).json({ message: 'Error retrieving products' });
  }
}

export async function getProductById(req, res) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error('[Product] getProductById error:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
}

export async function createProduct(req, res) {
  try {
    const body = req.body;
    const slug = body.id.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const { data, error } = await supabase
      .from('products')
      .insert({ ...body, slug })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Product with this ID already exists' });
      }
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('[Product] createProduct error:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
}

export async function updateProduct(req, res) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error('[Product] updateProduct error:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('[Product] deleteProduct error:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
}

export async function uploadProductImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer, 'svem-products');

    // Update product image in DB
    const { data, error } = await supabase
      .from('products')
      .update({ image: imageUrl, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ imageUrl, product: data });
  } catch (error) {
    console.error('[Product] uploadImage error:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
}
