import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HERO_SLIDES = [
  { src: "/images/home/hero-1.png", fallback: "lezedora-hero-1" },
  { src: "/images/home/hero-2.png", fallback: "lezedora-hero-2" },
  { src: "/images/home/hero-3.png", fallback: "lezedora-hero-3" },
];

export default function HomePage() {
  const [active, setActive] = useState(0);

  // Auto slideshow
  useEffect(() => {
    const t = setInterval(() => {
      setActive((i) => (i + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-10">
      {/* HERO (FULL BACKGROUND SLIDER) */}
      <section className="relative rounded-3xl border bg-white overflow-hidden min-h-[420px] md:min-h-[480px]">
        {/* Slides */}
        {HERO_SLIDES.map((s, idx) => (
          <img
            key={s.src}
            src={s.src}
            alt={`Lezedora hero ${idx + 1}`}
            className={[
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              idx === active ? "opacity-100" : "opacity-0",
            ].join(" ")}
            onError={(e) => {
              e.currentTarget.src = `https://picsum.photos/seed/${s.fallback}/1600/900`;
            }}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Content */}
        <div className="relative p-6 md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Modern e-commerce • clean catalog • fast checkout
          </div>

          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Discover delicate pieces
            <span className="block">curated for everyday</span>
            <span className="block">elegance.</span>
          </h1>

          <p className="mt-4 text-white/85 max-w-xl">
            Lezedora helps customers browse collections, view product details,
            add to cart, and place orders with a smooth, modern experience.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/collections"
              className="rounded-xl bg-white px-5 py-3 text-black font-semibold hover:bg-white/90"
            >
              Browse Collections
            </Link>
            <Link
              to="/products"
              className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/15"
            >
              View Products
            </Link>
            <Link
              to="/cart"
              className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/15"
            >
              Go to Cart
            </Link>
          </div>
        </div>

        {/* Dots (centered) */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={[
                "h-2.5 w-2.5 rounded-full border border-white/60 transition",
                idx === active ? "bg-white" : "bg-white/20 hover:bg-white/40",
              ].join(" ")}
            />
          ))}
        </div>
      </section>

      {/* TRUST STRIP (OUTSIDE HERO) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
        <div className="rounded-2xl border bg-gray-50 p-3">
          <div className="font-semibold text-gray-900">JWT Auth</div>
          Customers + Admin roles
        </div>
        <div className="rounded-2xl border bg-gray-50 p-3">
          <div className="font-semibold text-gray-900">Orders</div>
          Stock updates on checkout
        </div>
        <div className="rounded-2xl border bg-gray-50 p-3">
          <div className="font-semibold text-gray-900">Catalog</div>
          Filter + search products
        </div>
      </section>

      {/* FEATURES */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Why Lezedora</h2>
            <p className="mt-1 text-sm text-gray-600">
              A simple full-stack e-commerce experience with real backend logic.
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm font-semibold underline underline-offset-4"
          >
            Explore products
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* Card 1 (WITH IMAGE) */}
          <div className="rounded-3xl border bg-white overflow-hidden">
            <div className="h-40 bg-gray-100">
              <img
                src="/images/home/feature-collections1.png"
                alt="Collections"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://picsum.photos/seed/lezedora-collections/900/600";
                }}
              />
            </div>

            <div className="p-6">
              <div className="text-xs text-gray-500">01</div>
              <h3 className="mt-2 text-lg font-bold">Curated Collections</h3>
              <p className="mt-2 text-sm text-gray-600">
                Browse categories designed for gifting, seasonal drops, and
                signature favorites.
              </p>

              <Link
                to="/collections"
                className="mt-4 inline-flex text-sm font-semibold underline underline-offset-4"
              >
                View collections
              </Link>
            </div>
          </div>

          {/* Card 2 (CENTER CARD WITH IMAGE) */}
          <div className="rounded-3xl border bg-white overflow-hidden">
            <div className="h-40 bg-gray-100">
              <img
                src="/images/home/feature-collections2.png"
                alt="Stock and checkout"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://picsum.photos/seed/lezedora-stock/900/600";
                }}
              />
            </div>

            <div className="p-6">
              <div className="text-xs text-gray-500">02</div>
              <h3 className="mt-2 text-lg font-bold">Real-time Stock</h3>
              <p className="mt-2 text-sm text-gray-600">
                Products show stock quantity, and checkout reduces stock
                automatically using a transaction.
              </p>

              <Link
                to="/cart"
                className="mt-4 inline-flex text-sm font-semibold underline underline-offset-4"
              >
                Try checkout
              </Link>
            </div>
          </div>

          {/* Card 3 (WITH IMAGE) */}
          <div className="rounded-3xl border bg-white overflow-hidden">
            <div className="h-40 bg-gray-100">
              <img
                src="/images/home/logo - Copy.png"
                alt="Secure accounts"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://picsum.photos/seed/lezedora-auth/900/600";
                }}
              />
            </div>

            <div className="p-6">
              <div className="text-xs text-gray-500">03</div>
              <h3 className="mt-2 text-lg font-bold">Secure Accounts</h3>
              <p className="mt-2 text-sm text-gray-600">
                Signup/Login with JWT authentication and protected routes for
                customers and admins.
              </p>

              <Link
                to="/my-orders"
                className="mt-4 inline-flex text-sm font-semibold underline underline-offset-4"
              >
                Track orders
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl border bg-gray-50 p-6 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight">
              Ready to place your next order?
            </h3>
            <p className="mt-2 text-gray-600">
              Add products to cart and checkout in seconds.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/products"
              className="rounded-xl bg-black px-5 py-3 text-white font-semibold hover:opacity-90"
            >
              Shop now
            </Link>
            <Link
              to="/my-orders"
              className="rounded-xl border px-5 py-3 font-semibold hover:bg-white"
            >
              My orders
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
