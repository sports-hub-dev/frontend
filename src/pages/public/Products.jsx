import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import { productsApi } from "../../api/products.api";
import ProductGrid from "../../components/product/ProductGrid";
import Pagination from "../../components/ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { SPECIAL_VENDOR_IDS, getEntityId } from "../../constants/specialVendors";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name (A–Z)" },
];

const IMG_PADEL = "https://res.cloudinary.com/dsfa43amy/image/upload/v1785761159/Padel_r2sgcp.png";
const IMG_JACKET = "https://res.cloudinary.com/dsfa43amy/image/upload/v1784385791/2ca85078-9dd2-42c6-84d6-7af661d0c56c.png";

const chipClass = (on) =>
  `sh-chip min-h-[44px] whitespace-nowrap rounded-full border-[1.5px] px-4 py-2 text-sm font-semibold ${
    on ? "border-navy-900 bg-navy-900 text-white" : "border-navy-200 bg-white text-navy-900 hover:border-navy-400"
  }`;

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
        setProducts(data.data.filter((p) => !SPECIAL_VENDOR_IDS.includes(getEntityId(p.vendorId))));
        setMeta(data.meta);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, category, minPrice, maxPrice, sort]);

  const clearFilters = () => setSearchParams(new URLSearchParams());
  const total = meta.total ?? products.length;
  const priceActive = Boolean(minPrice || maxPrice);

  const PriceFields = (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-navy-900">Price Range (EGP)</h4>
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor="min-price">Minimum price</label>
        <input id="min-price" type="number" min="0" placeholder="Min" defaultValue={minPrice} key={`min-${minPrice}`}
          onBlur={(e) => updateParam("minPrice", e.target.value)}
          className="h-11 w-full rounded-xl border-[1.5px] border-navy-200 px-3 text-sm focus:border-amber focus:outline-none" />
        <span className="text-navy-300">–</span>
        <label className="sr-only" htmlFor="max-price">Maximum price</label>
        <input id="max-price" type="number" min="0" placeholder="Max" defaultValue={maxPrice} key={`max-${maxPrice}`}
          onBlur={(e) => updateParam("maxPrice", e.target.value)}
          className="h-11 w-full rounded-xl border-[1.5px] border-navy-200 px-3 text-sm focus:border-amber focus:outline-none" />
      </div>
    </div>
  );

  return (
    <div className="bg-navy-50">
      {/* ── Hero with drifting outlined words ───────────────────────────── */}
      <section className="relative overflow-hidden bg-navy-ink pt-24 text-white">
        <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-center gap-2 opacity-50">
          <div className="sh-track sh-outline flex w-max gap-12 whitespace-nowrap font-editorial text-[110px] font-bold leading-none sm:text-[150px]">
            <span>UNIFORMS · PPE · PADEL · JACKETS ·</span><span>UNIFORMS · PPE · PADEL · JACKETS ·</span>
          </div>
          <div className="sh-track-rev sh-outline flex w-max gap-12 whitespace-nowrap font-editorial text-[110px] font-bold leading-none sm:text-[150px]">
            <span>VESTS · HELMETS · SAFETY SHOES ·</span><span>VESTS · HELMETS · SAFETY SHOES ·</span>
          </div>
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-10 px-6 pb-24 sm:px-8">
          <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-5">
            <p className="sh-rise text-[13px] font-semibold uppercase tracking-[0.22em] text-amber">The Collection</p>
            <h1 className="sh-rise font-editorial text-6xl font-semibold leading-[0.96] tracking-tight sm:text-8xl" style={{ "--sh-step": "0.08s" }}>
              All Products
            </h1>
            <p className="sh-rise max-w-lg text-lg leading-relaxed text-navy-100" style={{ "--sh-step": "0.2s" }}>
              Uniforms and PPE built for delivery routes, warehouses and the padel court. All prices in EGP.
            </p>
          </div>
          <div aria-hidden="true" className="sh-rise relative hidden h-[320px] flex-[0_1_420px] md:block" style={{ "--sh-step": "0.32s" }}>
            <div className="sh-float absolute left-0 top-8 flex h-[250px] w-[200px] items-center justify-center overflow-hidden rounded-[22px] bg-navy-50 shadow-lift">
              <img src={IMG_PADEL} alt="" className="block h-auto w-full" />
            </div>
            <div className="sh-float2 absolute right-0 top-0 flex h-[280px] w-[210px] items-center justify-center overflow-hidden rounded-[22px] bg-[#F4F4F4] shadow-lift">
              <img src={IMG_JACKET} alt="" className="block h-full w-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky toolbar: categories + sort ───────────────────────────── */}
      <div className="sticky top-16 z-30 border-b border-navy-100 bg-navy-50/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <div role="tablist" aria-label="Categories" className="-mx-1 flex max-w-full gap-2 overflow-x-auto px-1 pb-1 sm:pb-0">
            <button role="tab" aria-selected={!category} onClick={() => updateParam("category", "")} className={chipClass(!category)}>
              All
            </button>
            {categories.map((c) => (
              <button key={c} role="tab" aria-selected={category === c} onClick={() => updateParam("category", c)} className={chipClass(category === c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="sr-only">Sort</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="h-11 rounded-full border-[1.5px] border-navy-200 bg-white px-4 text-sm font-medium text-navy-900 focus:border-amber focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button
              onClick={() => setFiltersOpen(true)}
              className={`btn-transition h-11 rounded-full border-[1.5px] px-4 text-sm font-semibold ${priceActive ? "border-amber bg-amber/15 text-navy-900" : "border-navy-200 bg-white text-navy-900 hover:border-navy-400"}`}
            >
              Price{priceActive ? " ·" : ""}
            </button>
          </div>
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────────────────── */}
      <section className="px-4 pb-24 pt-10 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-navy-500">
              {loading ? "Loading products…" : `${total} ${total === 1 ? "product" : "products"}${category ? ` in ${category}` : ""}`}
            </p>
            {(category || priceActive) && (
              <button onClick={clearFilters} className="text-sm font-semibold text-navy-900 underline underline-offset-4">Clear all filters</button>
            )}
          </div>
          <ProductGrid key={`${category}-${sort}-${minPrice}-${maxPrice}-${page}`} products={products} loading={loading} />
          <div className="mt-10">
            <Pagination page={meta.page || page} totalPages={meta.totalPages} onPageChange={setPage} />
          </div>
        </div>
      </section>

      {/* Price drawer, rendered on <body> so it covers the whole screen */}
      {typeof document !== "undefined" &&
        createPortal(
          <div className={`fixed inset-0 z-50 ${filtersOpen ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!filtersOpen}>
            <div
              className={`absolute inset-0 bg-navy-ink/50 transition-opacity duration-300 ${filtersOpen ? "opacity-100" : "opacity-0"}`}
              onClick={() => setFiltersOpen(false)}
            />
            <div
              role="dialog"
              aria-label="Price filter"
              className={`absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col gap-6 overflow-y-auto bg-white p-6 shadow-lift transition-transform duration-300 ease-out ${filtersOpen ? "translate-x-0" : "translate-x-full"}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-editorial text-2xl font-semibold text-navy-900">Filters</h3>
                <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="flex h-11 w-11 items-center justify-center rounded-full text-navy-500 hover:bg-navy-50">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
                </button>
              </div>
              {PriceFields}
              <div className="mt-auto flex gap-2">
                <button onClick={clearFilters} className="h-12 flex-1 rounded-full border-[1.5px] border-navy-200 text-sm font-semibold text-navy-900">Clear</button>
                <button onClick={() => setFiltersOpen(false)} className="h-12 flex-1 rounded-full bg-navy-900 text-sm font-semibold text-white">Show results</button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Products;
