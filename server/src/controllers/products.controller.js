const pool = require("../config/db");

// GET /api/products?collectionId=1&search=soap
async function getAllProducts(req, res, next) {
  try {
    const { collectionId, search } = req.query;

    let sql = `
      SELECT 
        p.id, p.collection_id, c.title AS collection_title,
        p.name, p.description, p.price, p.image_url, p.stock_qty, p.is_active, p.created_at
      FROM products p
      JOIN collections c ON c.id = p.collection_id
      WHERE 1=1
    `;
    const params = [];

    if (collectionId) {
      sql += " AND p.collection_id = ? ";
      params.push(Number(collectionId));
    }

    if (search) {
      sql += " AND (p.name LIKE ? OR p.description LIKE ?) ";
      params.push(`%${search}%`, `%${search}%`);
    }

    // Only show active products to public users
    // If you want admins to see all later, we can add logic.
    sql += " AND p.is_active = 1 ";

    sql += " ORDER BY p.created_at DESC ";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:id
async function getProductById(req, res, next) {
  try {
    const id = Number(req.params.id);

    const [rows] = await pool.query(
      `
      SELECT 
        p.id, p.collection_id, c.title AS collection_title,
        p.name, p.description, p.price, p.image_url, p.stock_qty, p.is_active, p.created_at
      FROM products p
      JOIN collections c ON c.id = p.collection_id
      WHERE p.id = ?
      `,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Product not found" });

    // If product is inactive, we hide it (public behavior)
    if (rows[0].is_active !== 1) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// POST /api/products (admin)
async function createProduct(req, res, next) {
  try {
    const { collection_id, name, description, price, image_url, stock_qty, is_active } = req.body;

    // Check collection exists
    const [col] = await pool.query("SELECT id FROM collections WHERE id = ?", [collection_id]);
    if (col.length === 0) return res.status(400).json({ message: "Invalid collection_id" });

    const [result] = await pool.query(
      `
      INSERT INTO products (collection_id, name, description, price, image_url, stock_qty, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        Number(collection_id),
        name,
        description || null,
        Number(price),
        image_url || null,
        stock_qty != null ? Number(stock_qty) : 0,
        is_active != null ? Number(is_active) : 1
      ]
    );

    const [rows] = await pool.query(
      `
      SELECT 
        p.id, p.collection_id, c.title AS collection_title,
        p.name, p.description, p.price, p.image_url, p.stock_qty, p.is_active, p.created_at
      FROM products p
      JOIN collections c ON c.id = p.collection_id
      WHERE p.id = ?
      `,
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// PUT /api/products/:id (admin)
async function updateProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { collection_id, name, description, price, image_url, stock_qty, is_active } = req.body;

    const [existing] = await pool.query("SELECT id FROM products WHERE id = ?", [id]);
    if (existing.length === 0) return res.status(404).json({ message: "Product not found" });

    // Check collection exists
    const [col] = await pool.query("SELECT id FROM collections WHERE id = ?", [collection_id]);
    if (col.length === 0) return res.status(400).json({ message: "Invalid collection_id" });

    await pool.query(
      `
      UPDATE products
      SET collection_id = ?, name = ?, description = ?, price = ?, image_url = ?, stock_qty = ?, is_active = ?
      WHERE id = ?
      `,
      [
        Number(collection_id),
        name,
        description || null,
        Number(price),
        image_url || null,
        stock_qty != null ? Number(stock_qty) : 0,
        is_active != null ? Number(is_active) : 1,
        id
      ]
    );

    const [rows] = await pool.query(
      `
      SELECT 
        p.id, p.collection_id, c.title AS collection_title,
        p.name, p.description, p.price, p.image_url, p.stock_qty, p.is_active, p.created_at
      FROM products p
      JOIN collections c ON c.id = p.collection_id
      WHERE p.id = ?
      `,
      [id]
    );

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/products/:id (admin)
async function deleteProduct(req, res, next) {
  try {
    const id = Number(req.params.id);

    const [existing] = await pool.query("SELECT id FROM products WHERE id = ?", [id]);
    if (existing.length === 0) return res.status(404).json({ message: "Product not found" });

    await pool.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
