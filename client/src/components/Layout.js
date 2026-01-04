import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { getUser, isLoggedIn, logout } from "../utils/auth";
import { useCart } from "../context/CartContext";

const navLinkClass = ({ isActive }) =>
  [
    "px-3 py-2 rounded-xl text-sm font-medium transition",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50",
    "whitespace-nowrap",
    isActive
      ? "bg-gray-900 text-white shadow-sm ring-1 ring-amber-300/30"
      : "text-gray-700 hover:text-amber-800 hover:bg-amber-50/70",
  ].join(" ");

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(isLoggedIn());
  const [user, setUser] = useState(getUser());

  const navigate = useNavigate();
  const location = useLocation();

  const { items } = useCart();
  const cartCount = items.reduce((sum, x) => sum + Number(x.quantity || 0), 0);

  const syncAuth = () => {
    setAuthed(isLoggedIn());
    setUser(getUser());
  };

  useEffect(() => {
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  useEffect(() => {
    syncAuth();
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("cart_items_guest");
    window.dispatchEvent(new Event("storage"));
    syncAuth();
    setOpen(false);
    navigate("/login");
  };

  const AuthLinksDesktop = () => {
    if (!authed) {
      return (
        <div className="flex items-center gap-1">
          <NavLink to="/login" className={navLinkClass}>
            Login
          </NavLink>
          <NavLink to="/signup" className={navLinkClass}>
            Sign up
          </NavLink>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1">
        {user?.role === "admin" && (
          <NavLink to="/admin/orders" className={navLinkClass}>
            Admin Orders
          </NavLink>
        )}

        <NavLink to="/my-orders" className={navLinkClass}>
          My Orders
        </NavLink>

        <button
          onClick={handleLogout}
          className={[
            "px-3 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap",
            "text-gray-700 hover:text-amber-800 hover:bg-amber-50/70",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50",
          ].join(" ")}
        >
          Logout{user?.name ? ` (${user.name})` : ""}
        </button>
      </div>
    );
  };

  const AuthLinksMobile = () => {
    if (!authed) {
      return (
        <>
          <NavLink
            to="/login"
            className={navLinkClass}
            onClick={() => setOpen(false)}
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            className={navLinkClass}
            onClick={() => setOpen(false)}
          >
            Sign up
          </NavLink>
        </>
      );
    }

    return (
      <>
        {user?.role === "admin" && (
          <NavLink
            to="/admin/orders"
            className={navLinkClass}
            onClick={() => setOpen(false)}
          >
            Admin Orders
          </NavLink>
        )}

        <NavLink
          to="/my-orders"
          className={navLinkClass}
          onClick={() => setOpen(false)}
        >
          My Orders
        </NavLink>

        <button
          onClick={handleLogout}
          className={[
            "text-left px-3 py-2 rounded-xl text-sm font-medium transition",
            "text-gray-700 hover:text-amber-800 hover:bg-amber-50/70",
          ].join(" ")}
        >
          Logout{user?.name ? ` (${user.name})` : ""}
        </button>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 text-[17px] md:text-[18px]">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-2">
          <div className="flex h-16 items-center justify-between gap-3">
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={() => setOpen(false)}
            >
              <img
                src="/images/logo.png"
                alt="Lezedora"
                className="h-14 md:h-16 w-auto object-contain"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
                About
              </NavLink>
              <NavLink to="/collections" className={navLinkClass}>
                Collections
              </NavLink>
              <NavLink to="/products" className={navLinkClass}>
                Products
              </NavLink>
              <NavLink to="/delivery" className={navLinkClass}>
                Delivery
              </NavLink>
              <NavLink to="/stockists" className={navLinkClass}>
                Stockists
              </NavLink>

              <div className="mx-2 h-6 w-px bg-gray-200" />

              <NavLink to="/cart" className={navLinkClass}>
                Cart{cartCount > 0 ? ` (${cartCount})` : ""}
              </NavLink>

              <div className="mx-2 h-6 w-px bg-gray-200" />

              <AuthLinksDesktop />
            </nav>

            <button
              className="md:hidden inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm hover:bg-amber-50/70 hover:text-amber-800"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>

          {open && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col gap-2 pt-3">
                <NavLink
                  to="/"
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/about"
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  About
                </NavLink>
                <NavLink
                  to="/collections"
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  Collections
                </NavLink>
                <NavLink
                  to="/products"
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  Products
                </NavLink>
                <NavLink
                  to="/delivery"
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  Delivery
                </NavLink>
                <NavLink
                  to="/stockists"
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  Stockists
                </NavLink>

                <div className="my-2 h-px bg-gray-200" />

                <NavLink
                  to="/cart"
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  Cart{cartCount > 0 ? ` (${cartCount})` : ""}
                </NavLink>

                <div className="mt-2 pt-2 border-t flex flex-col gap-2">
                  <AuthLinksMobile />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-2 py-8">{children}</main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-2 py-6 text-sm text-gray-600">
          © {new Date().getFullYear()} Lezedora. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
