const pool = require("../config/db");

// Helper: calculate totals safely
function toNumber(val) {
  const n = Number(val);
  return Number.isFinite(n) ? n : 0;
}

/**
 * POST /api/orders (protected)
 * Body:
 * {
 *   "delivery_address": "...",
 *   "phone": "...",
 *   "items": [
 *     { "product_id": 1, "quantity": 2 },
 *     { "product_id": 3, "quantity": 1 }
 *   ]
 * }
 */
async function createOrder(req, res, next) {
  const connection = await pool.getConnection();

  try {
    const userId = req.user.id;
    const { delivery_address, phone, items } = req.body;

    // Basic guard (optional but safe)
    if (!delivery_address || !phone) {
      return res.status(400).json({
        message: "Validation error",
        details: [
          !delivery_address
            ? {
                field: "delivery_address",
                message: "delivery_address is required",
              }
            : null,
          !phone ? { field: "phone", message: "phone is required" } : null,
        ].filter(Boolean),
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Validation error",
        details: [
          { field: "items", message: "items must be a non-empty array" },
        ],
      });
    }

    await connection.beginTransaction();

    // 1) Validate items exist
    const productIds = items.map((i) => Number(i.product_id));
    const [products] = await connection.query(
      `SELECT id, price, stock_qty, is_active
       FROM products
       WHERE id IN (${productIds.map(() => "?").join(",")})`,
      productIds
    );

    if (products.length !== productIds.length) {
      await connection.rollback();
      return res
        .status(400)
        .json({ message: "One or more products are invalid" });
    }

    // 2) Check active + stock, compute total
    let total = 0;

    for (const item of items) {
      const pid = Number(item.product_id);
      const qty = Number(item.quantity);

      const product = products.find((p) => p.id === pid);

      if (!product || product.is_active !== 1) {
        await connection.rollback();
        return res
          .status(400)
          .json({ message: `Product ${pid} is not available` });
      }

      if (!Number.isInteger(qty) || qty <= 0) {
        await connection.rollback();
        return res
          .status(400)
          .json({ message: "Each item quantity must be a positive integer" });
      }

      if (product.stock_qty < qty) {
        await connection.rollback();
        return res
          .status(409)
          .json({ message: `Not enough stock for product ${pid}` });
      }

      total += toNumber(product.price) * qty;
    }

    // 3) Create order
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, status, total_amount, delivery_address, phone)
       VALUES (?, 'pending', ?, ?, ?)`,
      [userId, total.toFixed(2), delivery_address, phone]
    );

    const orderId = orderResult.insertId;

    // 4) Insert order_items and decrease stock
    for (const item of items) {
      const pid = Number(item.product_id);
      const qty = Number(item.quantity);
      const product = products.find((p) => p.id === pid);

      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES (?, ?, ?, ?)`,
        [orderId, pid, qty, product.price]
      );

      await connection.query(
        `UPDATE products SET stock_qty = stock_qty - ? WHERE id = ?`,
        [qty, pid]
      );
    }

    await connection.commit();

    // 5) Return created order
    const [orderRows] = await pool.query(
      `SELECT id, user_id, status, total_amount, delivery_address, phone, created_at
       FROM orders WHERE id = ?`,
      [orderId]
    );

    res.status(201).json(orderRows[0]);
  } catch (err) {
    try {
      await connection.rollback();
    } catch (_) {}
    next(err);
  } finally {
    connection.release();
  }
}

// GET /api/orders/my (protected)  ✅ NOW RETURNS ITEMS TOO
async function getMyOrders(req, res, next) {
  try {
    const userId = req.user.id;

    // 1) Get orders
    const [orders] = await pool.query(
      `SELECT id, user_id, status, total_amount, delivery_address, phone, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    if (orders.length === 0) return res.json([]);

    const orderIds = orders.map((o) => o.id);

    // 2) Get items for all these orders
    const [items] = await pool.query(
      `SELECT
         oi.order_id,
         oi.product_id,
         p.name AS product_name,
         oi.quantity,
         oi.unit_price
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id IN (?)
       ORDER BY oi.order_id DESC, oi.id ASC`,
      [orderIds]
    );

    // 3) Group items by order_id
    const itemsByOrderId = {};
    for (const it of items) {
      if (!itemsByOrderId[it.order_id]) itemsByOrderId[it.order_id] = [];
      itemsByOrderId[it.order_id].push({
        product_id: it.product_id,
        product_name: it.product_name,
        quantity: it.quantity,
        unit_price: it.unit_price,
      });
    }

    // 4) Attach to each order
    const result = orders.map((o) => ({
      ...o,
      items: itemsByOrderId[o.id] || [],
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:id (protected, owner or admin)
async function getOrderById(req, res, next) {
  try {
    const orderId = Number(req.params.id);

    const [orders] = await pool.query(
      `SELECT id, user_id, status, total_amount, delivery_address, phone, created_at
       FROM orders WHERE id = ?`,
      [orderId]
    );

    if (orders.length === 0)
      return res.status(404).json({ message: "Order not found" });

    const order = orders[0];

    const isOwner = order.user_id === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not allowed to view this order" });
    }

    const [items] = await pool.query(
      `SELECT oi.id, oi.product_id, p.name AS product_name, oi.quantity, oi.unit_price
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    res.json({ ...order, items });
  } catch (err) {
    next(err);
  }
}

// PUT /api/orders/:id/status (admin)
async function updateOrderStatus(req, res, next) {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    const allowed = ["pending", "paid", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const [existing] = await pool.query("SELECT id FROM orders WHERE id = ?", [
      orderId,
    ]);
    if (existing.length === 0)
      return res.status(404).json({ message: "Order not found" });

    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [
      status,
      orderId,
    ]);

    const [rows] = await pool.query(
      `SELECT id, user_id, status, total_amount, delivery_address, phone, created_at
       FROM orders WHERE id = ?`,
      [orderId]
    );

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}
// GET /api/orders (admin) - list all orders (with items)
async function getAllOrders(req, res, next) {
  try {
    // 1) get all orders (+ user info if users table exists)
    const [orders] = await pool.query(
      `SELECT 
         o.id,
         o.user_id,
         o.status,
         o.total_amount,
         o.delivery_address,
         o.phone,
         o.created_at,
         u.name AS user_name,
         u.email AS user_email
       FROM orders o
       LEFT JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`
    );

    if (!orders || orders.length === 0) {
      return res.json([]);
    }

    // 2) get all items for these orders
    const orderIds = orders.map((o) => o.id);
    const [items] = await pool.query(
      `SELECT 
         oi.order_id,
         oi.product_id,
         p.name AS product_name,
         oi.quantity,
         oi.unit_price
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id IN (${orderIds.map(() => "?").join(",")})
       ORDER BY oi.order_id DESC`,
      orderIds
    );

    // 3) attach items to each order
    const itemsByOrderId = {};
    for (const it of items) {
      if (!itemsByOrderId[it.order_id]) itemsByOrderId[it.order_id] = [];
      itemsByOrderId[it.order_id].push(it);
    }

    const result = orders.map((o) => ({
      ...o,
      items: itemsByOrderId[o.id] || [],
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
};
