import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CollectionsPage from "./pages/CollectionsPage";
import ProductsPage from "./pages/ProductsPage";
import DeliveryPage from "./pages/DeliveryPage";
import StockistsPage from "./pages/StockistsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage"; // ✅ NEW

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/stockists" element={<StockistsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} /> {/* ✅ NEW */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
