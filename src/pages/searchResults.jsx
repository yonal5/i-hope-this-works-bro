import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/productCard";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResultsPage() {
  const query = useQuery();
  const q = (query.get("search") || "").trim().toLowerCase();

  // Replace with real products source (context, api, etc.)
  const products = window.__ALL_PRODUCTS__ || [];

  const results = useMemo(() => {
    if (!q) return [];
    return products.filter((p) => ((p.title || p.name || "") + " " + (p.description || "")).toLowerCase().includes(q));
  }, [products, q]);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Search results for "{q}"</h1>
      {results.length === 0 ? (
        <div>No results found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {results.map((p) => <ProductCard key={p.id || p.productID} product={p} />)}
        </div>
      )}
    </div>
  );
}