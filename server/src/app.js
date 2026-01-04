const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

dotenv.config(); // load .env first

const pool = require("./config/db");

// Routes
const authRoutes = require("./routes/auth.routes");
const collectionsRoutes = require("./routes/collections.routes");
const productsRoutes = require("./routes/products.routes");
const ordersRoutes = require("./routes/orders.routes");

// Error middleware
const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express();

// Global middleware
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true
  })
);

app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "lezedora-server" });
});

// DB test
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ db: "connected", result: rows[0] });
  } catch (err) {
    res.status(500).json({ db: "not connected", message: err.message });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);

// Errors
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Lezedora API running on http://localhost:${PORT}`);
});
