import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } =
    useCart();

  if (!items || items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-semibold">Your Cart</h1>
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Your Cart</h1>
          <p className="mt-1 text-sm text-gray-600">
            Review items and proceed to checkout.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Clear cart
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => {
            const price = Number(product.price || 0);
            const lineTotal = price * Number(quantity || 0);

            return (
              <div
                key={product.id}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="flex gap-4">
                  <img
                    src={
                      product.image_url ||
                      "https://picsum.photos/seed/lezedora-cart-fallback/300/240"
                    }
                    alt={product.name}
                    className="h-24 w-24 rounded-xl object-cover bg-gray-100"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${price.toFixed(2)} each
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Qty</span>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) =>
                            updateQuantity(product.id, e.target.value)
                          }
                          className="w-20 rounded-xl border px-3 py-2 text-sm"
                        />
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-600">Line total</p>
                        <p className="text-lg font-semibold">
                          ${lineTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Product ID:{" "}
                      <span className="font-semibold">{product.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm h-fit">
          <h2 className="text-lg font-semibold">Summary</h2>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Shipping/taxes can be added later if you want.
          </p>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-5 w-full rounded-xl bg-black px-4 py-2.5 text-white hover:opacity-90"
          >
            Proceed to checkout
          </button>

          <Link
            to="/products"
            className="mt-3 block text-center text-sm text-gray-700 underline"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
