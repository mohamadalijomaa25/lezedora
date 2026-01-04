import React from "react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  const values = [
    {
      title: "Gentle by design",
      text: "We formulate with comfort in mind—soft textures, balanced scents, and daily-use essentials.",
    },
    {
      title: "Thoughtful ingredients",
      text: "Every product is built around purposeful ingredients and a simple, transparent approach.",
    },
    {
      title: "Made for rituals",
      text: "From quick mornings to slow nights—our collections fit real routines without the fuss.",
    },
    {
      title: "Minimal, luxurious feel",
      text: "A clean look, premium feel, and calm experience—online and in the products themselves.",
    },
  ];

  const promises = [
    "Skin-friendly, everyday formulas",
    "Simple routines that actually stick",
    "Comfortable scents (never overpowering)",
    "Curated collections for different moods",
  ];

  return (
    <div className="space-y-12">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl border bg-white">
        <div className="relative h-[360px] md:h-[420px]">
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />

          <div className="absolute inset-0 flex items-end">
            <div className="p-6 md:p-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                Self-care • body • skincare • essentials
              </div>

              <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                A self-care company
                <span className="block">built for calm, daily rituals.</span>
              </h1>

              <p className="mt-4 text-white/90">
                Lezedora creates minimal, luxurious essentials that make your
                routine feel softer—whether you’re doing a quick reset or a full
                evening wind-down.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="rounded-xl bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-amber-50/70 hover:text-amber-800 transition"
                >
                  Shop products
                </Link>
                <Link
                  to="/collections"
                  className="rounded-xl border border-white/40 px-5 py-3 font-semibold text-white hover:bg-white/10 transition"
                >
                  Browse collections
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border bg-white p-6 md:p-8">
          <h2 className="text-2xl font-bold tracking-tight">Our story</h2>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Lezedora started with a simple idea: self-care should feel premium,
            but never complicated. We focus on essentials—products you’ll reach
            for every day—designed to be gentle, reliable, and easy to love.
          </p>
          <p className="mt-3 text-gray-600 leading-relaxed">
            We curate collections so you can shop by mood and routine: refresh,
            hydrate, soothe, and glow. The goal is a calm experience from
            browsing to checkout—and from first use to the last drop.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {promises.map((p) => (
              <span
                key={p}
                className="inline-flex items-center rounded-full border bg-amber-50/60 px-3 py-1 text-sm text-amber-900"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border bg-white overflow-hidden">
          <div className="h-64 md:h-full bg-gray-100">
            <img
              src="/images/home/company.png"
              alt="Product details"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://picsum.photos/seed/lezedora-about-story/1200/900";
              }}
            />
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">What we stand for</h2>
            <p className="mt-1 text-sm text-gray-600">
              Small details that make the whole experience feel better.
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm font-semibold text-amber-800 underline underline-offset-4 hover:text-amber-900"
          >
            Explore products
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="rounded-3xl border bg-white p-6">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border bg-amber-50/70 text-amber-900 font-bold">
                ✦
              </div>
              <h3 className="mt-3 text-lg font-bold">{v.title}</h3>
              <p className="mt-2 text-gray-600">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THE RITUAL */}
      <section className="rounded-3xl border bg-white p-6 md:p-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold tracking-tight">The Lezedora ritual</h2>
            <p className="mt-2 text-gray-600">
              A simple flow that fits real life. Mix and match based on your day.
            </p>

            <div className="mt-5 flex gap-3">
              <Link
                to="/collections"
                className="rounded-xl bg-gray-900 px-5 py-3 text-white font-semibold hover:opacity-90"
              >
                View collections
              </Link>
              <Link
                to="/cart"
                className="rounded-xl border px-5 py-3 font-semibold hover:bg-amber-50/70 hover:text-amber-800 transition"
              >
                Go to cart
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border bg-amber-50/50 p-5">
              <div className="text-xs font-semibold text-amber-900">STEP 01</div>
              <h3 className="mt-2 font-bold">Cleanse</h3>
              <p className="mt-2 text-sm text-amber-900/80">
                Start fresh with gentle textures that don’t strip the skin.
              </p>
            </div>

            <div className="rounded-3xl border bg-amber-50/50 p-5">
              <div className="text-xs font-semibold text-amber-900">STEP 02</div>
              <h3 className="mt-2 font-bold">Hydrate</h3>
              <p className="mt-2 text-sm text-amber-900/80">
                Light, comfortable moisture for everyday softness.
              </p>
            </div>

            <div className="rounded-3xl border bg-amber-50/50 p-5">
              <div className="text-xs font-semibold text-amber-900">STEP 03</div>
              <h3 className="mt-2 font-bold">Glow</h3>
              <p className="mt-2 text-sm text-amber-900/80">
                Finish with a calm finish—clean scent, smooth feel, easy confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="rounded-3xl border bg-white p-6 md:p-10">
        <h2 className="text-2xl font-bold tracking-tight">FAQ</h2>
        <div className="mt-6 space-y-3">
          <details className="rounded-2xl border bg-gray-50 p-4">
            <summary className="cursor-pointer font-semibold text-gray-900">
              Are your products suitable for daily use?
            </summary>
            <p className="mt-2 text-gray-600">
              Yes—our products are designed to fit everyday routines with a gentle,
              comfortable feel.
            </p>
          </details>

          <details className="rounded-2xl border bg-gray-50 p-4">
            <summary className="cursor-pointer font-semibold text-gray-900">
              How do I choose the right collection?
            </summary>
            <p className="mt-2 text-gray-600">
              Start with your goal: refresh, hydrate, soothe, or glow. Each collection
              is curated so you can build a simple routine quickly.
            </p>
          </details>

          <details className="rounded-2xl border bg-gray-50 p-4">
            <summary className="cursor-pointer font-semibold text-gray-900">
              Can I track my orders?
            </summary>
            <p className="mt-2 text-gray-600">
              Yes. Once you place an order, you can view it in <b>My Orders</b>.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
