import axios from "axios";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import ProductCard from "../components/productCard";
import Header, { ProductNews, TtitleBar,} from "../components/header";
import React from "react";

export function ProductPage() {
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const searchQuery = (query.get("search") || "").trim().toLowerCase();
  const categoryQuery = (query.get("category") || "").trim().toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // infinite-scroll / loop state
  const BATCH_SIZE = 12;
  const [visibleProducts, setVisibleProducts] = useState([]); // items shown in the grid
  const nextIndexRef = useRef(0); // next slice start index in filtered array
  const sentinelRef = useRef(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // guard ref to avoid concurrent loadMore calls
  const isLoadingRef = useRef(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      axios.get(import.meta.env.VITE_API_URL + "/api/products").then(
        (response)=>{
            setProducts(response.data || []);
            setLoading(false);
        }
      ).catch((error)=>{
          console.error("Error fetching products:", error);
          setLoading(false);
          toast.error("Failed to load products");
      });
    }
    load();
  }, []);

  // compute filtered list based on search/category
  const filtered = useMemo(() => {
    if (!searchQuery && !categoryQuery) return products;
    return products.filter((p) => {
      const name = (p.title || p.name || "").toString().toLowerCase();
      const matchesName = !searchQuery || name.includes(searchQuery);
      const prodCategory = (p.category || "").toString().toLowerCase();
      const matchesCategory = !categoryQuery || prodCategory.includes(categoryQuery);
      return matchesName && matchesCategory;
    });
  }, [products, searchQuery, categoryQuery]);

  // (re)initialize visibleProducts whenever filtered list changes
  useEffect(() => {
    // reset loading guard
    isLoadingRef.current = false;
    nextIndexRef.current = 0;
    if (filtered.length === 0) {
      setVisibleProducts([]);
      return;
    }
    const start = 0;
    const end = Math.min(filtered.length, BATCH_SIZE);
    setVisibleProducts(filtered.slice(start, end));
    nextIndexRef.current = end % filtered.length;
  }, [filtered]);

  // load more items (looping) — show loader for 1.5s on each load
  const loadMore = useCallback(() => {
    if (filtered.length === 0) return;
    if (isLoadingRef.current) return; // prevent concurrent loads
    isLoadingRef.current = true;
    setLoadingMore(true);

    // simulate network/loading delay (1.5s) before appending next batch
    setTimeout(() => {
      const start = nextIndexRef.current;
      const batch = [];
      for (let i = 0; i < BATCH_SIZE; i++) {
        const idx = (start + i) % filtered.length;
        batch.push(filtered[idx]);
      }
      nextIndexRef.current = (start + BATCH_SIZE) % filtered.length;
      setVisibleProducts((prev) => [...prev, ...batch]);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }, 1500);
  }, [filtered]);

  // IntersectionObserver to trigger loadMore when sentinel visible
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      });
    }, {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    });
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [loadMore]);

  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-orange-100">
      {
        loading ? <Loader/> :

        <div className="w-full h-full flex flex-row flex-wrap justify-center loop bg-white">
          {
            filtered.length === 0 ? (
              <div className="p-8">No products found.</div>
            ) : (
              <>
                {visibleProducts.map((item, i) => {
                  // key includes index to avoid duplicate-key issues when looping
                  return (
                    <ProductCard key={`${item.productID || item.id}-${i}`} product={item}/>
                  );
                })}
                {/* sentinel for intersection observer */}
                <div ref={sentinelRef} className="w-full flex justify-center items-center my-6">
                  {loadingMore ? <div className="text-sm text-gray-600">Loading more...</div> : <div className="text-sm text-gray-400">Scroll to load more</div>}
                </div>
              </>
            )
          }
        </div>
      }
    </div>
  )
}

export default function Pagination({ total, page, pageSize, onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between w-full mt-4">
      <div className="text-sm text-gray-600">
        Showing {(page - 1) * pageSize + 1} - {Math.min(total, page * pageSize)} of {total}
      </div>

      <div className="flex items-center gap-2">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-2 py-1 border rounded"
          aria-label="Items per page"
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}/page
            </option>
          ))}
        </select>

        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          {"<<"}
        </button>
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          {"<"}
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 border rounded ${p === page ? "bg-primary text-white" : ""}`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          {">"}
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}