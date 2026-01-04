-- Lezedora DB Schema + Seed Data
-- Database: lezedora_db

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS collections;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- USERS
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- COLLECTIONS
CREATE TABLE collections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- PRODUCTS (belongs to collections)
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  collection_id INT NOT NULL,
  name VARCHAR(140) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(255),
  stock_qty INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_collection
    FOREIGN KEY (collection_id) REFERENCES collections(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ORDERS (belongs to users)
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  status ENUM('pending','paid','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  delivery_address VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ORDER ITEMS (belongs to orders, references products)
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Collections
INSERT INTO collections (title, description, image_url) VALUES
('Signature Collection', 'Our best-loved items curated for daily use.', 'https://picsum.photos/seed/lezedora-col-1/800/600'),
('Seasonal Specials', 'Limited editions inspired by the season.', 'https://picsum.photos/seed/lezedora-col-2/800/600'),
('Gift Sets', 'Thoughtful bundles for any occasion.', 'https://picsum.photos/seed/lezedora-col-3/800/600');

-- Seed Products
INSERT INTO products (collection_id, name, description, price, image_url, stock_qty, is_active) VALUES
(1, 'Lezedora Hand Cream', 'Hydrating hand cream with a light modern scent.', 9.99, 'https://picsum.photos/seed/lezedora-prod-1/900/700', 40, 1),
(1, 'Lezedora Body Mist', 'Refreshing body mist for everyday use.', 14.50, 'https://picsum.photos/seed/lezedora-prod-2/900/700', 25, 1),
(2, 'Winter Citrus Candle', 'Seasonal candle with citrus notes and warm vanilla.', 18.00, 'https://picsum.photos/seed/lezedora-prod-3/900/700', 15, 1),
(2, 'Spiced Tea Soap', 'Handmade soap with a cozy spiced aroma.', 6.50, 'https://picsum.photos/seed/lezedora-prod-4/900/700', 60, 1),
(3, 'Mini Gift Set', 'A small set perfect for quick gifting.', 22.00, 'https://picsum.photos/seed/lezedora-prod-5/900/700', 12, 1);

-- NOTE:
-- We are NOT inserting users here because password_hash must be created by the backend (bcrypt).
