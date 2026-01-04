import React from "react";
import { Link } from "react-router-dom";

export default function DeliveryPage() {
  const zones = [
    { name: "Beirut", time: "Same day / Next day", fee: "$3.00" },
    { name: "Mount Lebanon", time: "1–2 business days", fee: "$4.00" },
    { name: "North / South / Bekaa", time: "2–4 business days", fee: "$6.00" },
  ];

  const rules = [
    "Orders are processed Mon–Sat (excluding public holidays).",
    "You’ll receive an order confirmation after checkout.",
    "Delivery times are estimates and may vary during peak periods.",
    "If an item is out of stock after ordering, we’ll contact you to replace or refund it.",
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Delivery</h1>
          <p className="mt-1 text-sm text-gray-600">
            Shipping zones, delivery times, and helpful information.
          </p>
        </div>

        <Link
          to="/products"
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Shop products
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Zones */}
        <div className="lg:col-span-2 rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Shipping zones</h2>
          <p className="mt-1 text-sm text-gray-600">
            Fees are shown per order. Free shipping promotions can be added
            later.
          </p>

          <div className="mt-4 grid gap-3">
            {zones.map((z) => (
              <div
                key={z.name}
                className="flex items-center justify-between rounded-xl border bg-gray-50 p-4"
              >
                <div>
                  <p className="font-semibold text-gray-900">{z.name}</p>
                  <p className="text-sm text-gray-600">{z.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Fee</p>
                  <p className="font-semibold">{z.fee}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm h-fit">
          <h2 className="text-lg font-semibold">Need help?</h2>
          <p className="mt-2 text-sm text-gray-600">
            For delivery questions, contact us:
          </p>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email</span>
              <span className="font-semibold">support@lezedora.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Phone</span>
              <span className="font-semibold">+961 70 123 456</span>
            </div>
          </div>

          
        </div>
      </div>

      {/* Rules */}
      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Delivery notes</h2>
        <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc pl-5">
          {rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
