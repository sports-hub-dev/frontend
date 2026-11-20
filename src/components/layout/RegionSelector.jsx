import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { REGIONS } from "../../constants/regions";
import { useRegion } from "../../hooks/useRegion";
import { useAuth } from "../../hooks/useAuth";
import { dismissRemovedNotice } from "../../app/cartSlice";
import { cn } from "../../utils/cn";

/**
 * Header control: pick the region you buy in. The region decides the currency
 * for every price on the site, and checkout delivers to that country only.
 */
const RegionSelector = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const { region, setRegion } = useRegion();
  const { user } = useAuth();
  const chosen = useSelector((s) => s.region.chosen);
  const cartCount = useSelector((s) => s.cart.items.length);
  const removed = useSelector((s) => s.cart.removedOnRegionChange);

  // A DSP user starts in their company's country, unless they already picked one themselves.
  useEffect(() => {
    if (user?.vendorId && user?.country && !chosen && user.country !== region.code) {
      setRegion(user.country, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, user?.country]);

  useEffect(() => {
    if (removed?.length) {
      toast(`Removed from your cart (not sold in ${region.name}): ${removed.join(", ")}`, { duration: 6000 });
      dispatch(dismissRemovedNotice());
    }
  }, [removed, region.name, dispatch]);

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const choose = (code) => {
    setOpen(false);
    if (code === region.code) return;
    setRegion(code, true);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Region: ${region.name}, prices in ${region.currency}. Change region`}
        className="btn-transition flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-navy-100 hover:bg-white/10"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span className="hidden lg:inline">{region.short}</span>
        <span className="hidden text-navy-400 lg:inline">·</span>
        <span className="font-mono text-xs font-semibold text-amber">{region.currency}</span>
        <svg className={cn("h-3 w-3 text-navy-300 transition-transform", open && "rotate-180")} viewBox="0 0 12 8" fill="none" aria-hidden="true">
          <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right animate-scaleIn rounded-xl border border-navy-100 bg-white p-1.5 shadow-lift">
          <p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-wider text-navy-400">Region and currency</p>
          <ul role="listbox" aria-label="Region">
            {REGIONS.map((r) => {
              const active = r.code === region.code;
              return (
                <li key={r.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => choose(r.code)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm",
                      active ? "bg-navy-50 font-semibold text-navy-900" : "text-navy-700 hover:bg-navy-50"
                    )}
                  >
                    <span>{r.name}</span>
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-xs text-navy-500">{r.currency}</span>
                      {active && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="border-t border-navy-100 px-3 pb-1.5 pt-2 text-[11px] leading-snug text-navy-400">
            Prices and delivery follow the region you pick.
            {cartCount > 0 && " Items in your cart will be re-priced."}
          </p>
        </div>
      )}
    </div>
  );
};

export default RegionSelector;
