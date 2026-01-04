import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { getUser, isLoggedIn } from "../utils/auth";
import { Link, useNavigate } from "react-router-dom";

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const user = getUser();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statuses = useMemo(
    () => ["pending", "paid", "shipped", "delivered", "cancelled"],
    []
  );

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    if (user?.role !== "admin") {
      navigate("/");
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/orders");
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
  }, [navigate, user?.role]);

  const updateStatus = async (orderId, status) => {
    let snapshot = null;

    // optimistic update + capture snapshot safely
    setOrders((cur) => {
      snapshot = cur;
      return cur.map((o) => (o.id === orderId ? { ...o, status } : o));
    });

    try {
      await api.put(`/api/orders/${orderId}/status`, { status });
    } catch (err) {
      if (snapshot) setOrders(snapshot); // rollback
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message ||
          "Failed to update status"
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Admin Orders</h1>
          <p className="mt-1 text-sm text-gray-600">
            View all customer orders and update status.
          </p>
        </div>

        <Link
          to="/"
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Back home
        </Link>
      </div>

      {loading && (
        <div className="mt-6 rounded-2xl border bg-white p-6">Loading...</div>
      )}

      {error && !loading && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="mt-6 rounded-2xl border bg-white p-6 text-sm text-gray-700">
          No orders yet.
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="mt-6 grid gap-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-600">Order</p>
                  <p className="text-lg font-semibold">#{o.id}</p>

                  <p className="mt-1 text-sm text-gray-600">
                    <span className="text-gray-500">User:</span> {o.user_id}
                    {o.user_name ? ` • ${o.user_name}` : ""}
                    {o.user_email ? ` • ${o.user_email}` : ""}
                  </p>
                </div>

                <select
                  value={o.status || "pending"}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="rounded-xl border px-3 py-2 text-sm bg-white"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 text-sm text-gray-700 space-y-1">
                <div>
                  <span className="text-gray-500">Total:</span> $
                  {Number(o.total_amount || 0).toFixed(2)}
                </div>

                {o.created_at && (
                  <div>
                    <span className="text-gray-500">Placed:</span>{" "}
                    {new Date(o.created_at).toLocaleString()}
                  </div>
                )}

                {o.delivery_address && (
                  <div>
                    <span className="text-gray-500">Address:</span>{" "}
                    {o.delivery_address}
                  </div>
                )}

                {o.phone && (
                  <div>
                    <span className="text-gray-500">Phone:</span> {o.phone}
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
                              <>
                                {" "}
                                • Unit: ${Number(it.unit_price).toFixed(2)}
                              </>
                            )}
                          </p>
                        </div>

                        {it.unit_price != null && (
                          <div className="shrink-0 font-semibold text-gray-900">
                            ${(
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
