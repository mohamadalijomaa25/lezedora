import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/api/products/${id}`);
        if (mounted) setProduct(res.data);
      } catch (err) {
        if (mounted)
          setError(
            err?.response?.data?.message ||
              err.message ||
              "Failed to load product"
          );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-2xl border p-6 text-gray-600">
        Loading product...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
        <Link
          to="/products"
          className="inline-flex rounded-xl border px-4 py-2 font-semibold hover:bg-gray-50"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border p-6 text-gray-600">
          Product not found.
        </div>
        <Link
          to="/products"
          className="inline-flex rounded-xl border px-4 py-2 font-semibold hover:bg-gray-50"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const price = Number(product.price || 0).toFixed(2);
  const inStock = Number(product.stock_qty || 0) > 0;

  const handleAdd = () => {
    if (!inStock) return;
    addToCart(product, 1);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link to="/products" className="hover:underline">
          Products
        </Link>{" "}
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-semibold">{product.name}</span>
      </div>

      {/* Main card */}
      <div className="grid gap-6 lg:grid-cols-2 rounded-3xl border bg-white overflow-hidden">
        {/* Image */}
        <div className="bg-gray-100">
          <img
            src={
              product.image_url ||
              "https://picsum.photos/seed/lezedora-prod-fallback/1200/900"
            }
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="p-6 md:p-8 space-y-5">
          <div className="inline-flex rounded-full border bg-gray-50 px-3 py-1 text-xs text-gray-600">
            {product.collection_title}
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {product.name}
          </h1>

          <p className="text-gray-600">{product.description}</p>

          <div className="flex items-center justify-between rounded-2xl border p-4">
            <div>
              <div className="text-sm text-gray-500">Price</div>
              <div className="text-2xl font-extrabold">${price}</div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500">Stock</div>
              <div
                className={`text-sm font-semibold ${
                  inStock ? "text-green-700" : "text-red-700"
                }`}
              >
                {inStock ? `${product.stock_qty} available` : "Out of stock"}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              disabled={!inStock}
              className={`rounded-xl px-5 py-3 font-semibold text-white ${
                inStock
                  ? "bg-black hover:opacity-90"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleAdd}
            >
              Add to cart
            </button>

            <Link
              to="/products"
              className="rounded-xl border px-5 py-3 font-semibold hover:bg-gray-50"
            >
              Back to Products
            </Link>
          </div>

          <div className="text-xs text-gray-500">
            Product ID: <span className="font-semibold">{product.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
