const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/products.controller");

const { requireAuth, requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation error",
      details: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
}

// Public
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin only
router.post(
  "/",
  requireAuth,
  requireAdmin,
  [
    body("collection_id").isInt({ min: 1 }).withMessage("collection_id must be a valid integer"),
    body("name").trim().notEmpty().withMessage("name is required"),
    body("price").isFloat({ min: 0.01 }).withMessage("price must be >= 0.01"),
    body("stock_qty").optional().isInt({ min: 0 }).withMessage("stock_qty must be >= 0"),
    body("is_active").optional().isInt({ min: 0, max: 1 }).withMessage("is_active must be 0 or 1")
  ],
  validate,
  createProduct
);

router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  [
    body("collection_id").isInt({ min: 1 }).withMessage("collection_id must be a valid integer"),
    body("name").trim().notEmpty().withMessage("name is required"),
    body("price").isFloat({ min: 0.01 }).withMessage("price must be >= 0.01"),
    body("stock_qty").optional().isInt({ min: 0 }).withMessage("stock_qty must be >= 0"),
    body("is_active").optional().isInt({ min: 0, max: 1 }).withMessage("is_active must be 0 or 1")
  ],
  validate,
  updateProduct
);

router.delete("/:id", requireAuth, requireAdmin, deleteProduct);

module.exports = router;
