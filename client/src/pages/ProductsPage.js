import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import  api  from "../services/api";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const collectionId = searchParams.get("collectionId") || "";
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(initialSearch);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (collectionId) params.set("collectionId", collectionId);
    if (initialSearch) params.set("search", initialSearch);
    return params.toString();
  }, [collectionId, initialSearch]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const url = queryString ? `/api/products?${queryString}` : "/api/products";
        const res = await api.get(url);

        if (mounted) setProducts(res.data);
      } catch (err) {
        if (mounted) setError(err?.response?.data?.message || err.message || "Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [queryString]);

  function onSubmit(e) {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (search.trim()) next.set("search", search.trim());
    else next.delete("search");
    setSearchParams(next);
  }

  function clearFilters() {
    setSearch("");
    setSearchParams({});
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Products</h1>
          <p className="mt-2 text-gray-600">Browse items and open any product to view details.</p>

          {(collectionId || initialSearch) && (
            <div className="mt-2 text-sm text-gray-500">
              Active filters:{" "}
              {collectionId && <span className="font-semibold">collectionId={collectionId} </span>}
              {initialSearch && <span className="font-semibold">search=&quot;{initialSearch}&quot;</span>}
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            className="w-64 max-w-[70vw] rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            Search
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            Clear
          </button>
        </form>
      </div>

      {loading && <div className="rounded-2xl border p-6 text-gray-600">Loading products...</div>}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="group rounded-3xl border overflow-hidden bg-white hover:shadow-sm transition"
            >
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                  src={p.image_url || "https://picsum.photos/seed/lezedora-prod-fallback/900/700"}
                  alt={p.name}
                  className="h-full w-full object-cover group-hover:scale-[1.02] transition"
                  loading="lazy"
                />
              </div>

              <div className="p-6">
                <div className="text-xs text-gray-500">{p.collection_title}</div>
                <h3 className="mt-1 text-lg font-bold">{p.name}</h3>
                <p className="mt-2 line-clamp-2 text-gray-600">{p.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm font-semibold">${Number(p.price).toFixed(2)}</div>
                  <div className="text-xs text-gray-500">Stock: {p.stock_qty}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="rounded-2xl border p-6 text-gray-600">No products found. Try clearing filters.</div>
      )}
    </div>
  );
}
