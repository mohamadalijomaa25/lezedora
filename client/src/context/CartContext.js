import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getUser, isLoggedIn } from "../utils/auth";

const CartContext = createContext(null);

function safeParse(raw) {
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getCartKey() {
  const user = getUser();
  if (isLoggedIn() && user?.id) return `cart_items_user_${user.id}`;
  return "cart_items_guest";
}

export function CartProvider({ children }) {
  const [storageKey, setStorageKey] = useState(getCartKey());

  // Load initial cart from current key (+ one-time migration from old global key)
  const [items, setItems] = useState(() => {
    const key = getCartKey();

    const legacyRaw = localStorage.getItem("cart_items");
    const currentRaw = localStorage.getItem(key);

    if (!currentRaw && legacyRaw) {
      localStorage.setItem(key, legacyRaw);
      localStorage.removeItem("cart_items");
      return safeParse(legacyRaw);
    }

    return safeParse(currentRaw);
  });

  // Switch cart owner (login/logout) => load cart from the correct key
  const syncCartOwner = () => {
    const nextKey = getCartKey();

    setStorageKey((prevKey) => {
      if (prevKey !== nextKey) {
        const raw = localStorage.getItem(nextKey);
        setItems(safeParse(raw));
      }
      return nextKey;
    });
  };

  // Run once on mount
  useEffect(() => {
    syncCartOwner();
    // eslint rule not available in your project, so no disable comments
  }, []);

  // Sync across tabs (storage fires on OTHER tabs)
  useEffect(() => {
    window.addEventListener("storage", syncCartOwner);
    return () => window.removeEventListener("storage", syncCartOwner);
  }, []);

  // Persist cart to localStorage on every change (to the current key)
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items, storageKey]);

  const addToCart = (product, quantity = 1) => {
    const qty = Number(quantity) || 1;

    setItems((prev) => {
      const existing = prev.find((x) => x.product.id === product.id);
      if (existing) {
        return prev.map((x) =>
          x.product.id === product.id
            ? { ...x, quantity: x.quantity + qty }
            : x
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((x) => x.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) return removeFromCart(productId);

    setItems((prev) =>
      prev.map((x) =>
        x.product.id === productId ? { ...x, quantity: qty } : x
      )
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, x) => {
      const price = Number(x.product.price) || 0;
      return sum + price * Number(x.quantity || 0);
    }, 0);
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      cartStorageKey: storageKey, // optional debug
      syncCartOwner, // optional manual sync
    }),
    [items, subtotal, storageKey]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
