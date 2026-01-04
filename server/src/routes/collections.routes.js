const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} = require("../controllers/collections.controller");

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

// Public
router.get("/", getAllCollections);
router.get("/:id", getCollectionById);

// Admin only
router.post(
  "/",
  requireAuth,
  requireAdmin,
  [body("title").trim().notEmpty().withMessage("Title is required")],
  validate,
  createCollection
);

router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  [body("title").trim().notEmpty().withMessage("Title is required")],
  validate,
  updateCollection
);

router.delete("/:id", requireAuth, requireAdmin, deleteCollection);

module.exports = router;
