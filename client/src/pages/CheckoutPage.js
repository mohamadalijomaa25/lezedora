import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { getUser, isLoggedIn } from "../utils/auth";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();

  const currentUser = getUser();

  // ✅ Per-user delivery key
  const deliveryKey = currentUser?.id
    ? `last_delivery_user_${currentUser.id}`
    : "last_delivery_guest";

  // ✅ Load saved delivery info for THIS user only
  const savedDelivery = (() => {
    try {
      const raw = localStorage.getItem(deliveryKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const [deliveryAddress, setDeliveryAddress] = useState(
    savedDelivery?.delivery_address || ""
  );
  const [phone, setPhone] = useState(savedDelivery?.phone || "");
  const [rememberDelivery, setRememberDelivery] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const cartCount = useMemo(
    () => items.reduce((sum, x) => sum + Number(x.quantity || 0), 0),
    [items]
  );

  const canSubmit =
    !submitting &&
    deliveryAddress.trim().length > 0 &&
    phone.trim().length > 0 &&
    items.length > 0;

  // If cart empty, show empty state
  if (!items || items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <div className="mt-6 rounded-2xl border bg-white p-6">
          <p className="text-gray-700">Your cart is empty.</p>
          <Link
            to="/products"
            className="mt-3 inline-block rounded-xl bg-black px-4 py-2 text-sm text-white hover:opacity-90"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  const goNext = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    const addr = deliveryAddress.trim();
    const ph = phone.trim();

    if (!addr) return setError("Delivery address is required.");
    if (!ph) return setError("Phone is required.");

    // Validate items
    const mappedItems = items.map((x) => ({
      product_id: x.product.id,
      quantity: Number(x.quantity),
    }));

    const bad = mappedItems.find(
      (it) => !Number.isInteger(it.quantity) || it.quantity <= 0
    );
    if (bad) {
      setError("Cart has an invalid quantity. Please go back to cart and fix it.");
      return;
    }

    const payload = {
      delivery_address: addr,
      phone: ph,
      items: mappedItems,
    };

    try {
      setSubmitting(true);
      await api.post("/api/orders", payload);

      // ✅ Save delivery info only if checkbox is ON and user is logged in
      if (rememberDelivery && currentUser?.id) {
        localStorage.setItem(
          deliveryKey,
          JSON.stringify({ delivery_address: addr, phone: ph })
        );
      }

      // ✅ If checkbox is OFF, remove saved delivery for this user (optional cleanup)
      if (!rememberDelivery && currentUser?.id) {
        localStorage.removeItem(deliveryKey);
      }

      clearCart();
      navigate("/my-orders", { state: { orderPlaced: true } });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Failed to place order.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Checkout</h1>
          <p className="mt-1 text-sm text-gray-600">
            Enter delivery details and confirm your order.
          </p>
        </div>

        <Link
          to="/cart"
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Back to cart
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <form
          onSubmit={goNext}
          className="lg:col-span-2 rounded-2xl border bg-white p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold">Delivery information</h2>

          <div className="mt-4 grid gap-4">
            <div>
              <label className="text-sm text-gray-700">Delivery address</label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => {
                  setDeliveryAddress(e.target.value);
                  if (error) setError("");
                }}
                rows={4}
                className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
                placeholder="City, street, building, floor..."
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Phone</label>
              <input
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError("");
                }}
                className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
                placeholder="70123456"
                required
              />
            </div>

            {/* ✅ Remember checkbox */}
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={rememberDelivery}
                onChange={(e) => setRememberDelivery(e.target.checked)}
                className="h-4 w-4"
              />
              Remember my delivery info on this account
            </label>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className={`mt-2 w-full rounded-xl px-4 py-2.5 text-white ${
                !canSubmit
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:opacity-90"
              }`}
            >
              {submitting ? "Placing order..." : "Place order"}
            </button>

            <p className="text-xs text-gray-500">
              You must be logged in to place an order.
            </p>
          </div>
        </form>

        {/* Summary */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm h-fit">
          <h2 className="text-lg font-semibold">Order summary</h2>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-600">Items</span>
            <span className="font-semibold">{cartCount}</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>

          <div className="mt-4 border-t pt-4 space-y-2">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="truncate pr-2 text-gray-700">
                  {product.name} × {quantity}
                </span>
                <span className="font-semibold">
                  ${(Number(product.price || 0) * Number(quantity || 0)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
