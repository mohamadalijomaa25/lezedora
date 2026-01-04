import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/api/collections");
        if (mounted) setCollections(res.data);
      } catch (err) {
        if (mounted)
          setError(
            err?.response?.data?.message ||
              err.message ||
              "Failed to load collections"
          );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Collections</h1>
          <p className="mt-2 text-gray-600">
            Browse curated collections and discover products you’ll love.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center justify-center rounded-xl border px-4 py-2 font-semibold hover:bg-gray-50"
        >
          View all products
        </Link>
      </div>

      {loading && (
        <div className="rounded-2xl border p-6 text-gray-600">
          Loading collections...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
          <div className="mt-2 text-sm text-red-600">
            Tip: make sure backend is running on{" "}
            <span className="font-semibold">http://localhost:5000</span>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-5 md:grid-cols-3">
          {collections.map((c) => (
            <Link
              key={c.id}
              to={`/products?collectionId=${c.id}`}
              className="group rounded-3xl border overflow-hidden bg-white hover:shadow-sm transition"
            >
              <div className="aspect-[4/3] bg-gray-100">
                <img
                  src={
                    c.image_url ||
                    "https://picsum.photos/seed/lezedora-fallback/900/700"
                  }
                  alt={c.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold group-hover:underline">
                  {c.title}
                </h3>
                <p className="mt-2 text-gray-600">{c.description}</p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Collection #{c.id}
                  </span>

                  <span className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-white font-semibold group-hover:opacity-90">
                    Explore
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && collections.length === 0 && (
        <div className="rounded-2xl border p-6 text-gray-600">
          No collections found.
        </div>
      )}
    </div>
  );
}
