const express = require("express");
const { body, validationResult } = require("express-validator");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders, // ✅ added
} = require("../controllers/orders.controller");

const { requireAuth, requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation error",
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

// ✅ GET /api/orders (admin) - list all orders
router.get("/", requireAuth, requireAdmin, getAllOrders);

// POST /api/orders (protected) - create order
router.post(
  "/",
  requireAuth,
  [
    body("delivery_address")
      .trim()
      .notEmpty()
      .withMessage("delivery_address is required"),
    body("phone").trim().notEmpty().withMessage("phone is required"),
    body("items")
      .isArray({ min: 1 })
      .withMessage("items must be a non-empty array"),
    body("items.*.product_id")
      .isInt({ min: 1 })
      .withMessage("product_id must be a valid integer"),
    body("items.*.quantity")
      .isInt({ min: 1 })
      .withMessage("quantity must be >= 1"),
  ],
  validate,
  createOrder
);

// GET /api/orders/my (protected)
router.get("/my", requireAuth, getMyOrders);

// GET /api/orders/:id (protected: owner/admin)
router.get("/:id", requireAuth, getOrderById);

// PUT /api/orders/:id/status (admin)
router.put(
  "/:id/status",
  requireAuth,
  requireAdmin,
  [body("status").trim().notEmpty().withMessage("status is required")],
  validate,
  updateOrderStatus
);

module.exports = router;
