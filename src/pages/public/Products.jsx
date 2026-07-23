import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { productsApi } from "../../api/products.api";
import ProductGrid from "../../components/product/ProductGrid";
import Pagination from "../../components/ui/Pagination";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { usePagination } from "../../hooks/usePagination";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name (A–Z)" },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, limit, setPage } = usePagination(12);

  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "newest";

  const updateParam = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams);
      if (value) params.set(key, value);
      else params.delete(key);
      params.set("page", "1");
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  // useEffect(() => {
  //   setLoading(true);
  //   productsApi
  //     .getProducts({ page, limit, category: category || undefined, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined, sort })
  //     .then(({ data }) => {
  //       setProducts(data.data);
  //       setMeta(data.meta);
  //       // Derive the category filter list from whatever the API returns across the current result set
  //       setCategories((prev) => {
  //         const found = new Set(prev);
  //         data.data.forEach((p) => found.add(p.category));
  //         return Array.from(found).sort();
  //       });
  //     })
  //     .catch(() => setProducts([]))
  //     .finally(() => setLoading(false));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [page, limit, category, minPrice, maxPrice, sort]);

  useEffect(() => {
    productsApi
      .getCategories()
      .then(({ data }) => setCategories(data.data.categories))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    productsApi
      .getProducts({ page, limit, category: category || undefined, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined, sort })
      .then(({ data }) => {
        setProducts(data.data);
        setMeta(data.meta);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, category, minPrice, maxPrice, sort]);

  const clearFilters = () => setSearchParams(new URLSearchParams());

  const FiltersPanel = (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 text-sm font-semibold text-navy-900">Category</h4>
        <div className="space-y-1.5">
          <button
            onClick={() => updateParam("category", "")}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${!category ? "bg-navy-900 text-white" : "text-navy-600 hover:bg-navy-50"}`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => updateParam("category", c)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${category === c ? "bg-navy-900 text-white" : "text-navy-600 hover:bg-navy-50"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold text-navy-900">Price Range (EGP)</h4>
        <div className="flex items-center gap-2">
          <Input type="number" min="0" placeholder="Min" defaultValue={minPrice} onBlur={(e) => updateParam("minPrice", e.target.value)} />
          <span className="text-navy-300">–</span>
          <Input type="number" min="0" placeholder="Max" defaultValue={maxPrice} onBlur={(e) => updateParam("maxPrice", e.target.value)} />
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
        Clear all filters
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">All Products</h1>
          <p className="text-sm text-navy-400">{meta.total ?? products.length} items available</p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            options={SORT_OPTIONS}
            containerClassName="w-48"
          />
          <button
            onClick={() => setFiltersOpen(true)}
            className="btn-transition rounded-lg border border-navy-200 px-3.5 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50 lg:hidden"
          >
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{FiltersPanel}</aside>

        {/* Mobile filter drawer */}
        <div className={`fixed inset-0 z-50 lg:hidden ${filtersOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
          <div
            className={`absolute inset-0 bg-navy-ink/50 transition-opacity duration-300 ${filtersOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setFiltersOpen(false)}
          />
          <div
            className={`absolute inset-y-0 right-0 w-80 max-w-[85vw] overflow-y-auto bg-white p-6 shadow-lift transition-transform duration-300 ease-out ${filtersOpen ? "translate-x-0" : "translate-x-full"
              }`}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-navy-900">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="rounded-full p-1.5 text-navy-400 hover:bg-navy-50">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {FiltersPanel}
          </div>
        </div>

        <div>
          <ProductGrid products={products} loading={loading} />
          <div className="mt-8">
            <Pagination page={meta.page || page} totalPages={meta.totalPages} onPageChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
