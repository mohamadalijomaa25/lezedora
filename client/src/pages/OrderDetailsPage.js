import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { getUser, isLoggedIn } from "../utils/auth";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statuses = useMemo(
    () => ["pending", "paid", "shipped", "delivered", "cancelled"],
    []
  );

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get(`/api/orders/${id}`);
        setOrder(res.data || null);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message ||
          "Failed to load order.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate]);

  const isAdmin = user?.role === "admin";

  const onChangeStatus = async (newStatus) => {
    if (!order) return;

    const prev = order;
    setOrder({ ...order, status: newStatus });

    try {
      setUpdatingStatus(true);
      await api.put(`/api/orders/${order.id}/status`, { status: newStatus });
    } catch (err) {
      setOrder(prev);
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message ||
          "Failed to update status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const calcItemsTotal = (items = []) =>
    items.reduce((sum, it) => {
      const unit = Number(it.unit_price || 0);
      const qty = Number(it.quantity || 0);
      return sum + unit * qty;
    }, 0);

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-gray-600">
        Loading order...
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
          to={isAdmin ? "/admin/orders" : "/my-orders"}
          className="inline-flex rounded-xl border px-4 py-2 font-semibold hover:bg-gray-50"
        >
          Back
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border bg-white p-6 text-gray-600">
          Order not found.
        </div>
        <Link
          to={isAdmin ? "/admin/orders" : "/my-orders"}
          className="inline-flex rounded-xl border px-4 py-2 font-semibold hover:bg-gray-50"
        >
          Back
        </Link>
      </div>
    );
  }

  const items = order.items || [];
  const itemsTotal = calcItemsTotal(items);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Order #{order.id}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {order.created_at
              ? `Placed: ${new Date(order.created_at).toLocaleString()}`
              : "Order details"}
          </p>
        </div>

        <Link
          to={isAdmin ? "/admin/orders" : "/my-orders"}
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Back
        </Link>
      </div>

      {/* Summary card */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-gray-700 space-y-1">
            <div>
              <span className="text-gray-500">User ID:</span> {order.user_id}
              {order.user_name ? ` • ${order.user_name}` : ""}
              {order.user_email ? ` • ${order.user_email}` : ""}
            </div>
            {order.delivery_address && (
              <div>
                <span className="text-gray-500">Address:</span>{" "}
                {order.delivery_address}
              </div>
            )}
            {order.phone && (
              <div>
                <span className="text-gray-500">Phone:</span> {order.phone}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm">
              <span className="rounded-full border px-3 py-1">
                {order.status || "pending"}
              </span>
            </div>

            {/* Admin status control */}
            {isAdmin && (
              <select
                value={order.status || "pending"}
                disabled={updatingStatus}
                onChange={(e) => onChangeStatus(e.target.value)}
                className="rounded-xl border px-3 py-2 text-sm bg-white disabled:opacity-60"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="mt-4 grid gap-2 text-sm text-gray-700">
          <div>
            <span className="text-gray-500">Items:</span> {items.length}
          </div>

          <div>
            <span className="text-gray-500">Items total:</span> $
            {itemsTotal.toFixed(2)}
          </div>

          {order.total_amount != null && (
            <div>
              <span className="text-gray-500">Order total:</span> $
              {Number(order.total_amount).toFixed(2)}
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Items</h2>

        {items.length === 0 ? (
          <div className="mt-4 text-sm text-gray-600">No items found.</div>
        ) : (
          <div className="mt-4 space-y-3">
            {items.map((it, idx) => (
              <div
                key={`${order.id}-${it.product_id}-${idx}`}
                className="flex items-center justify-between gap-4 rounded-xl border p-4"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate">
                    {it.product_name || `Product #${it.product_id}`}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    Qty: {it.quantity}
                    {it.unit_price != null && (
                      <>
                        {" "}
                        • Unit: ${Number(it.unit_price).toFixed(2)}
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-sm text-gray-500">Line total</div>
                  <div className="font-semibold">
                    ${(
                      Number(it.unit_price || 0) * Number(it.quantity || 0)
                    ).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
