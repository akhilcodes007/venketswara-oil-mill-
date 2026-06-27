import Product from "../models/Product.js";

/**
 * Lists products with smart filtering, sorting, search, and pagination.
 */
export async function getProducts(req, res) {
  const { category, minPrice, maxPrice, tag, search, sort, page = 1, limit = 12 } = req.query;

  try {
    const query = { enabled: true };

    // 1. Category Filter
    if (category && category !== "all") {
      query.category = category;
    }

    // 2. Tag Filter (Popular, Best Seller, New)
    if (tag) {
      query.tags = tag;
    }

    // 3. Search Filter (name, description, tamilName)
    if (search) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { tamilName: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // 4. Price Filter (checks if any variant falls in range)
    if (minPrice || maxPrice) {
      query["variants.price"] = {};
      if (minPrice) query["variants.price"].$gte = parseFloat(minPrice);
      if (maxPrice) query["variants.price"].$lte = parseFloat(maxPrice);
    }

    // Retrieve matching records
    let products = await Product.find(query);

    // 5. Sorting (price low->high, price high->low, name, newest)
    if (sort === "price-asc") {
      products.sort((a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0));
    } else if (sort === "price-desc") {
      products.sort((a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0));
    } else if (sort === "name") {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "newest") {
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "best-selling") {
      // Prioritize Best Seller tag
      products.sort((a, b) => {
        const aVal = a.tags.includes("Best Seller") ? 1 : 0;
        const bVal = b.tags.includes("Best Seller") ? 1 : 0;
        return bVal - aVal;
      });
    }

    // 6. Pagination
    const totalCount = products.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedProducts = products.slice(startIndex, startIndex + parseInt(limit));

    res.status(200).json({
      products: paginatedProducts,
      page: parseInt(page),
      pages: Math.ceil(totalCount / parseInt(limit)),
      totalProducts: totalCount,
    });
  } catch (error) {
    console.error("[Product Controller] List Products Error:", error);
    res.status(500).json({ message: "Server error retrieving products" });
  }
}

/**
 * Gets a single product by ID.
 */
export async function getProductById(req, res) {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("[Product Controller] Get Product Error:", error);
    res.status(500).json({ message: "Server error fetching product details" });
  }
}

/**
 * Admin: Creates a new product.
 */
export async function createProduct(req, res) {
  const { id, name, category, description, price, variants, tags, stock, enabled, rating } = req.body;

  try {
    const exists = await Product.findOne({ id });
    if (exists) {
      return res.status(400).json({ message: "Product with this ID already exists" });
    }

    const slug = id.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newProduct = await Product.create({
      id,
      slug,
      name,
      category,
      description,
      variants: variants || [{ size: "1 Litre", price: parseFloat(price) }],
      tags: tags || [],
      stock: stock || 0,
      enabled: enabled !== undefined ? enabled : true,
      rating: rating || 5,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("[Product Controller] Create Product Error:", error);
    res.status(500).json({ message: "Server error creating product" });
  }
}

/**
 * Admin: Updates an existing product.
 */
export async function updateProduct(req, res) {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update fields
    const updated = await Product.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("[Product Controller] Update Product Error:", error);
    res.status(500).json({ message: "Server error updating product" });
  }
}

/**
 * Admin: Deletes a product.
 */
export async function deleteProduct(req, res) {
  try {
    const deleted = await Product.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("[Product Controller] Delete Product Error:", error);
    res.status(500).json({ message: "Server error deleting product" });
  }
}
