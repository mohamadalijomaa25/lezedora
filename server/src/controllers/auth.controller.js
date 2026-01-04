const bcrypt = require("bcrypt");
const pool = require("../config/db");
const { signToken } = require("../utils/jwt");

async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'customer')",
      [name, email, password_hash]
    );

    const user = { id: result.insertId, name, email, role: "customer" };
    const token = signToken({ id: user.id, role: user.role });

    return res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      "SELECT id, name, email, password_hash, role FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userRow = rows[0];
    const match = await bcrypt.compare(password, userRow.password_hash);

    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = { id: userRow.id, name: userRow.name, email: userRow.email, role: userRow.role };
    const token = signToken({ id: user.id, role: user.role });

    return res.json({ user, token });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login };
