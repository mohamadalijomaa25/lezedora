# Lezedora — Full-Stack E-Commerce (React + Node/Express + MySQL)

Lezedora is a full-stack e-commerce/catalog web application built for a university project. It supports browsing collections and products, user authentication, and order creation with stock management.

## Live Links

- **Frontend (Vercel):** https://lezedora.vercel.app/
- **Backend API (Render):** https://lezedora.onrender.com

## Features

### Customer

- Browse **Collections** and **Products**
- Product search and filtering by collection
- View product details
- Sign up / log in (JWT-based)
- Place orders (creates `orders` + `order_items` in a single DB transaction, and decrements stock)

### Admin

- Role-based access (`admin` / `customer`)
- Manage Collections and Products (CRUD)
- Update order status (admin endpoint)

## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express, MySQL (`mysql2/promise`), JWT
- **Database:** MySQL (Local dev via XAMPP; production via Aiven MySQL)
- **Deployment:** Vercel (frontend), Render (backend), Aiven (MySQL)

## Project Structure

```
/client   -> React frontend (Tailwind)
/server   -> Node/Express backend + MySQL
```

## Environment Variables

### Backend (`/server/.env`)

Create a `.env` file based on the example below (do **not** commit real secrets):

```env
PORT=5000
NODE_ENV=development

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=lezedora_db

# If you use Aiven/SSL in production
# DB_SSL_CA="-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"

JWT_SECRET=change_me_to_a_long_random_string
```

### Frontend (`/client/.env`)

```env
REACT_APP_API_URL=http://localhost:5000
```

> In production on Vercel, set `REACT_APP_API_URL` to your Render backend URL:
> `https://lezedora.onrender.com`

## Local Setup (Development)

### 1) Database (Local XAMPP)

- Start **Apache** + **MySQL** in XAMPP.
- Create a database named `lezedora_db`.
- Import your schema/seed SQL into `lezedora_db` (via phpMyAdmin).

### 2) Backend (`/server`)

```bash
cd server
npm install
npm run dev
```

API should be available on:

- http://localhost:5000

### 3) Frontend (`/client`)

```bash
cd client
npm install
npm start
```

App should open on:

- http://localhost:3000

## API Overview (Key Endpoints)

- `GET /api/collections` — list collections
- `GET /api/products?collectionId=&search=` — list products with filters
- `GET /api/products/:id` — product details
- `POST /api/auth/signup` — create account
- `POST /api/auth/login` — login (returns JWT)
- `GET /api/auth/me` — current user (JWT)
- `POST /api/orders` — create order (transaction + stock decrement)
- `GET /api/orders/my` — customer orders (JWT)
- `PATCH /api/orders/:id/status` — admin update order status (JWT + admin)

## Notes

- If using Aiven MySQL in production, SSL may be required. Ensure the backend MySQL pool is configured with SSL and the CA certificate is provided via env vars.
- Make sure CORS allows your Vercel domain and `http://localhost:3000` for development.

## Author

- Mohamad Ali Jomaa
