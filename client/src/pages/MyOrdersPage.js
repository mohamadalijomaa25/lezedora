import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { isLoggedIn } from "../utils/auth";

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Show "Order placed" once (after redirect from checkout)
  useEffect(() => {
    if (location.state?.orderPlaced) {
      setSuccess(true);
      // Clear location state so it won't show again on refresh
      navigate("/my-orders", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    // Extra guard (ProtectedRoute already exists, but keeping this is OK)
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get("/api/orders/my");
        setOrders(res.data || []);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message ||
          "Failed to load orders.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My Orders</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track your recent orders and their status.
          </p>
        </div>

        <Link
          to="/products"
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Continue shopping
        </Link>
      </div>

      {success && (
        <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          ✅ Order placed successfully!
        </div>
      )}

      {loading && (
        <div className="mt-6 rounded-2xl border bg-white p-6">
          Loading orders...
        </div>
      )}

      {error && !loading && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="mt-6 rounded-2xl border bg-white p-6">
          <p className="text-gray-700">You don’t have any orders yet.</p>
          <Link
            to="/products"
            className="mt-3 inline-block rounded-xl bg-black px-4 py-2 text-sm text-white hover:opacity-90"
          >
            Browse products
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="mt-6 grid gap-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-600">Order</p>
                  <p className="text-lg font-semibold">#{o.id}</p>
                </div>

                <div className="text-sm">
                  <span className="rounded-full border px-3 py-1">
                    {o.status || "pending"}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-gray-700">
                {o.created_at && (
                  <div>
                    <span className="text-gray-500">Placed:</span>{" "}
                    {new Date(o.created_at).toLocaleString()}
                  </div>
                )}

                {o.total_amount != null && (
                  <div>
                    <span className="text-gray-500">Total:</span> $
                    {Number(o.total_amount).toFixed(2)}
                  </div>
                )}
              </div>

              {/* Items list */}
              {o.items && o.items.length > 0 && (
                <div className="mt-4 rounded-xl border bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-900">Items</p>

                  <div className="mt-3 space-y-2">
                    {o.items.map((it, idx) => (
                      <div
                        key={`${o.id}-${it.product_id}-${idx}`}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-900">
                            {it.product_name || `Product #${it.product_id}`}
                          </p>
                          <p className="text-gray-600">
                            Qty: {it.quantity}
                            {it.unit_price != null && (
                              <> • Unit: ${Number(it.unit_price).toFixed(2)}</>
                            )}
                          </p>
                        </div>

                        {it.unit_price != null && (
                          <div className="shrink-0 font-semibold text-gray-900">
                            $
                            {(
                              Number(it.unit_price) * Number(it.quantity)
                            ).toFixed(2)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ✅ View details */}
              <Link
                to={`/orders/${o.id}`}
                className="mt-4 inline-flex text-sm font-medium underline"
              >
                View details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
