import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { bundlesApi } from "../../api/bundles.api";
import { buildRoute, ROUTES } from "../../constants/routes";
import { formatPrice } from "../../utils/formatPrice";
import { useRegion } from "../../hooks/useRegion";
import { bundlePriceIn } from "../../constants/regions";
import { resolveImageUrl } from "../../utils/resolveImageUrl";
import Skeleton from "../../components/ui/Skeleton";

/** Which piece of the rider a bundle item covers, guessed from the product name. */
const PIECES = [
  { key: "helmet", test: /helmet/i },
  { key: "jacket", test: /jacket|coat|parka/i },
  { key: "vest", test: /vest|hi-?vis/i },
  { key: "shoes", test: /shoe|boot|footwear/i },
  { key: "pants", test: /pant|trouser/i },
  { key: "shirt", test: /shirt|tee|polo|top|jersey/i },
];
const pieceOf = (name = "") => (PIECES.find((p) => p.test.test(name)) || {}).key;

const Rider = ({ worn, label }) => {
  const on = (k) => worn.has(k);
  return (
    <svg viewBox="0 0 200 400" role="img" aria-label={label} className="relative block h-[460px] w-auto max-w-full sm:h-[520px]">
      <rect className={`sh-piece ${on("shoes") ? "sh-on" : ""}`} x="62" y="338" width="36" height="20" rx="7" fill={on("shoes") ? "#141A24" : "#1B2A4A"} stroke={on("shoes") ? "#F2A93B" : "#3E5288"} strokeWidth="2" />
      <rect className={`sh-piece ${on("shoes") ? "sh-on" : ""}`} x="102" y="338" width="36" height="20" rx="7" fill={on("shoes") ? "#141A24" : "#1B2A4A"} stroke={on("shoes") ? "#F2A93B" : "#3E5288"} strokeWidth="2" />
      <path className={`sh-piece ${on("pants") ? "sh-on" : ""}`} d="M74 198 H126 L131 340 H106 L100 232 L94 340 H69 Z" fill={on("pants") ? "#24365F" : "#1B2A4A"} stroke={on("pants") ? "#8595BC" : "#3E5288"} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="100" cy="50" r="22" fill="#1B2A4A" stroke="#3E5288" strokeWidth="2" />
      <path className={`sh-piece ${on("shirt") ? "sh-on" : ""}`} d="M66 86 Q100 74 134 86 L150 168 L133 174 L127 124 L126 202 H74 L73 124 L67 174 L50 168 Z" fill={on("shirt") ? "#1E7FD8" : "#1B2A4A"} stroke={on("shirt") ? "#8EC2F2" : "#3E5288"} strokeWidth="2" strokeLinejoin="round" />
      <g className={`sh-piece ${on("jacket") ? "sh-on" : ""}`} opacity={on("jacket") ? 1 : 0}>
        <path d="M62 84 Q100 70 138 84 L155 170 L135 178 L129 126 L128 208 H72 L71 126 L65 178 L45 170 Z" fill="#10192C" stroke="#1E7FD8" strokeWidth="2" strokeLinejoin="round" />
        <path d="M62 84 Q100 70 138 84 L144 118 H56 Z" fill="#1E7FD8" />
        <rect x="54" y="118" width="92" height="9" fill="#D5DBE5" />
        <line x1="100" y1="78" x2="100" y2="208" stroke="#B9C0CC" strokeWidth="2" strokeDasharray="3 3" />
      </g>
      <g className={`sh-piece ${on("vest") ? "sh-on" : ""}`} opacity={on("vest") ? 1 : 0}>
        <path d="M78 88 L92 86 L100 104 L108 86 L122 88 L126 198 H74 Z" fill="#F2A93B" stroke="#FFC56E" strokeWidth="2" strokeLinejoin="round" />
        <rect x="75" y="150" width="50" height="7" fill="#EEF1F7" />
        <rect x="75" y="172" width="50" height="7" fill="#EEF1F7" />
      </g>
      <g className={`sh-piece ${on("helmet") ? "sh-on" : ""}`} opacity={on("helmet") ? 1 : 0}>
        <path d="M73 54 A27 27 0 0 1 127 54 V60 H73 Z" fill="#EEF1F7" stroke="#FFFFFF" strokeWidth="2" />
        <rect x="79" y="54" width="42" height="8" rx="3" fill="#10192C" />
        <path d="M88 30 Q100 24 112 30" fill="none" stroke="#F2A93B" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
};

const Bundles = () => {
  const [bundles, setBundles] = useState([]);
  const { currency, region } = useRegion();
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    bundlesApi
      .getBundles({ limit: 20 })
      .then(({ data }) => {
        setBundles(data.data);
        if (data.data[0]) setActiveId(data.data[0]._id);
      })
      .catch(() => setBundles([]))
      .finally(() => setLoading(false));
  }, []);

  const active = bundles.find((b) => b._id === activeId);
  const worn = useMemo(
    () => new Set((active?.products || []).map((item) => pieceOf(item.product?.name)).filter(Boolean)),
    [active]
  );

  return (
    <div className="bg-navy-ink text-white">
      <section className="px-6 pb-10 pt-24 text-center sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
          <p className="sh-rise text-[13px] font-semibold uppercase tracking-[0.22em] text-amber">Bundle Deals</p>
          <h1 className="sh-rise font-editorial text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl" style={{ "--sh-step": "0.08s" }}>
            Build the full kit.
          </h1>
          <p className="sh-rise text-lg leading-relaxed text-navy-100" style={{ "--sh-step": "0.2s" }}>
            Save more when you buy these product combinations together. Pick a bundle to see it on the rider.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 pt-6 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-12">
          {/* Rider */}
          <div className="sh-rise relative flex h-[560px] min-w-0 flex-[1_1_320px] items-center justify-center overflow-hidden sm:h-[620px] sm:overflow-visible" style={{ "--sh-step": "0.3s" }}>
            <div className="absolute aspect-square w-[480px] max-w-full rounded-full bg-navy-900" />
            <div className="sh-ring absolute aspect-square w-[520px] max-w-full rounded-full border-2 border-dashed border-navy-500" />
            <div className="sh-ring2 absolute aspect-square w-[440px] max-w-[92%] rounded-full border border-navy-700 border-r-amber border-t-amber" />
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[220px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl">
              <div className="sh-scan h-[90px] bg-gradient-to-b from-transparent via-amber/15 to-transparent" />
            </div>
            <Rider worn={worn} label={active ? `Rider wearing the ${active.name}` : "Rider with no kit selected"} />
            {active && (
              <div key={active._id} className="sh-drop absolute right-2 top-6 max-w-[60%] truncate rounded-full bg-amber px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-navy-900 shadow-[0_12px_30px_rgba(242,169,59,.35)] sm:right-6">
                {active.name} ✓
              </div>
            )}
          </div>

          {/* Real bundles */}
          <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-4">
            {loading &&
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-36 w-full rounded-3xl" />)}

            {!loading && !bundles.length && (
              <div className="rounded-3xl border border-navy-700 bg-navy-900 p-8">
                <h2 className="font-editorial text-3xl font-semibold">No bundles available right now</h2>
                <p className="mt-2 text-navy-100">Check back soon for deals, or contact us to put together a kit for your team.</p>
                <Link to={ROUTES.CONTACT} className="mt-5 inline-block rounded-full bg-amber px-6 py-3 font-semibold text-navy-900 hover:bg-amber-300">Contact us</Link>
              </div>
            )}

            {!loading &&
              bundles.map((b) => {
                const isActive = b._id === activeId;
                return (
                  <div
                    key={b._id}
                    className={`sh-preset flex flex-col gap-4 rounded-3xl border-2 bg-navy-900 p-6 sm:flex-row sm:items-center ${isActive ? "border-amber" : "border-transparent"}`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveId(b._id)}
                      aria-pressed={isActive}
                      className="flex flex-1 items-center gap-4 text-left"
                    >
                      {b.mainImage && (
                        <img src={resolveImageUrl(b.mainImage)} alt="" className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
                      )}
                      <span className="flex min-w-0 flex-col gap-2">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-editorial text-2xl font-semibold leading-tight">{b.name}</span>
                          <span className="rounded-full bg-amber/15 px-2.5 py-1 text-xs font-bold text-amber">{b.discountPercentage}% OFF</span>
                        </span>
                        <span className="flex flex-wrap gap-1.5">
                          {(b.products || []).map((item, i) => (
                            <span key={i} className="rounded-full border border-navy-500 px-2.5 py-1 text-xs text-navy-100">
                              {item.quantity > 1 ? `${item.quantity}× ` : ""}{item.product?.name}
                            </span>
                          ))}
                        </span>
                      </span>
                    </button>
                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <span className="flex items-baseline gap-2">
                        {bundlePriceIn(b, currency).bundlePrice === null ? (
                          <span className="text-sm text-navy-300">Not sold in {region.short}</span>
                        ) : (
                          <>
                            <span className="font-mono text-lg font-semibold">{formatPrice(bundlePriceIn(b, currency).bundlePrice, currency)}</span>
                            {bundlePriceIn(b, currency).fullPrice > bundlePriceIn(b, currency).bundlePrice && (
                              <span className="font-mono text-sm text-navy-300 line-through">{formatPrice(bundlePriceIn(b, currency).fullPrice, currency)}</span>
                            )}
                          </>
                        )}
                      </span>
                      <Link to={buildRoute(ROUTES.BUNDLE_DETAIL, { id: b._id })} className="btn-transition rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-amber-300">
                        View bundle
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Bundles;
