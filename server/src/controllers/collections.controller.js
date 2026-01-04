const pool = require("../config/db");

// GET /api/collections
async function getAllCollections(req, res, next) {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, description, image_url, created_at FROM collections ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/collections/:id
async function getCollectionById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.query(
      "SELECT id, title, description, image_url, created_at FROM collections WHERE id = ?",
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Collection not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// POST /api/collections (admin)
async function createCollection(req, res, next) {
  try {
    const { title, description, image_url } = req.body;

    const [result] = await pool.query(
      "INSERT INTO collections (title, description, image_url) VALUES (?, ?, ?)",
      [title, description || null, image_url || null]
    );

    const [rows] = await pool.query(
      "SELECT id, title, description, image_url, created_at FROM collections WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// PUT /api/collections/:id (admin)
async function updateCollection(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { title, description, image_url } = req.body;

    const [existing] = await pool.query("SELECT id FROM collections WHERE id = ?", [id]);
    if (existing.length === 0) return res.status(404).json({ message: "Collection not found" });

    await pool.query(
      "UPDATE collections SET title = ?, description = ?, image_url = ? WHERE id = ?",
      [title, description || null, image_url || null, id]
    );

    const [rows] = await pool.query(
      "SELECT id, title, description, image_url, created_at FROM collections WHERE id = ?",
      [id]
    );

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/collections/:id (admin)
async function deleteCollection(req, res, next) {
  try {
    const id = Number(req.params.id);

    const [existing] = await pool.query("SELECT id FROM collections WHERE id = ?", [id]);
    if (existing.length === 0) return res.status(404).json({ message: "Collection not found" });

    // May fail if products reference this collection (ON DELETE RESTRICT)
    await pool.query("DELETE FROM collections WHERE id = ?", [id]);

    res.json({ message: "Collection deleted" });
  } catch (err) {
    // Make foreign key error friendlier
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message: "Cannot delete this collection because it has products. Delete products first."
      });
    }
    next(err);
  }
}

module.exports = {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
};
