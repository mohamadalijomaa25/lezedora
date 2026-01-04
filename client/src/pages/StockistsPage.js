import React, { useMemo, useState } from "react";

export default function StockistsPage() {
  const stockists = useMemo(
    () => [
      {
        name: "Lezedora Boutique – Hamra",
        city: "Beirut",
        address: "Hamra Street, Building 10",
        hours: "Mon–Sat: 10:00–18:00",
        phone: "+961 70 123 456",
      },
      {
        name: "Cedars Beauty Store",
        city: "Beirut",
        address: "Mar Mikhael, Armenia Street",
        hours: "Mon–Sat: 10:00–19:00",
        phone: "+961 76 222 333",
      },
      {
        name: "Mount Lebanon Essentials",
        city: "Mount Lebanon",
        address: "Jounieh, Main Road",
        hours: "Mon–Sat: 09:00–18:00",
        phone: "+961 71 444 555",
      },
      {
        name: "Bekaa Wellness Corner",
        city: "Bekaa",
        address: "Zahle, Boulevard",
        hours: "Mon–Fri: 10:00–17:00",
        phone: "+961 81 666 777",
      },
    ],
    []
  );

  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All");

  const cities = useMemo(() => {
    const unique = Array.from(new Set(stockists.map((s) => s.city)));
    return ["All", ...unique];
  }, [stockists]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stockists.filter((s) => {
      const cityOk = city === "All" || s.city === city;
      const qOk =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q);
      return cityOk && qOk;
    });
  }, [stockists, query, city]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Stockists</h1>
          <p className="mt-1 text-sm text-gray-600">
            Find Lezedora products at partner stores.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search store, city, address…"
            className="w-full sm:w-72 rounded-xl border px-3 py-2 text-sm"
          />

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full sm:w-48 rounded-xl border px-3 py-2 text-sm bg-white"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border bg-white p-6 text-sm text-gray-700">
              No stockists match your search.
            </div>
          ) : (
            filtered.map((s) => (
              <div
                key={`${s.name}-${s.city}`}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold">{s.name}</p>
                    <p className="text-sm text-gray-600">{s.city}</p>
                  </div>

                  <span className="rounded-full border bg-gray-50 px-3 py-1 text-xs text-gray-700">
                    In-store
                  </span>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-gray-700">
                  <div>
                    <span className="text-gray-500">Address:</span> {s.address}
                  </div>
                  <div>
                    <span className="text-gray-500">Hours:</span> {s.hours}
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span> {s.phone}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info card */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm h-fit">
          <h2 className="text-lg font-semibold">Stockist info</h2>
          <p className="mt-2 text-sm text-gray-600">
            Stock availability may vary by location. If you’re looking for a specific
            product, call the store first.
          </p>

          <div className="mt-4 rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
            <p className="font-medium text-gray-900">Want to become a stockist?</p>
            <p className="mt-1 text-sm text-gray-600">
              Email: <span className="font-semibold">partners@lezedora.com</span>
            </p>
          </div>

          
        </div>
      </div>
    </div>
  );
}
