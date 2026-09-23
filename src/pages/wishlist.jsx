import React, { useEffect, useState } from "react";
import ProductCard from "../components/productCard";

export default function WishlistPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // replace with real wishlist source
    const stored = window.__WISHLIST__ || JSON.parse(localStorage.getItem("wishlist") || "[]");
    setItems(stored);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Wishlist</h1>
      {items.length === 0 ? (
        <div>No items in wishlist.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((p, i) => <ProductCard key={p.id || i} product={p} />)}
        </div>
      )}
    </div>
  );
}