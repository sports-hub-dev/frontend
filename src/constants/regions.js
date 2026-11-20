/**
 * Regions the site sells in. Each region has its own currency, and every
 * product price per currency is typed in by the admin (no exchange-rate maths).
 */
export const REGIONS = [
  { code: "EG", name: "Egypt", short: "Egypt", currency: "EGP" },
  { code: "SA", name: "Saudi Arabia", short: "KSA", currency: "SAR" },
  { code: "AE", name: "United Arab Emirates", short: "UAE", currency: "AED" },
];

export const DEFAULT_REGION = "EG";

export const getRegion = (code) => REGIONS.find((r) => r.code === code) || REGIONS[0];

/** Price of a product in a currency, or null if it isn't sold there. */
export const productPriceIn = (product, currency) => {
  if (!product) return null;
  if (currency === "EGP") return typeof product.price === "number" ? product.price : null;
  const v = product.prices?.[currency];
  return typeof v === "number" && v > 0 ? v : null;
};

/** { bundlePrice, fullPrice } of a bundle in a currency (nulls if not sold there). */
export const bundlePriceIn = (bundle, currency) => {
  if (!bundle) return { bundlePrice: null, fullPrice: null };
  const p = bundle.pricesByCurrency?.[currency];
  if (p) return p;
  return currency === "EGP"
    ? { bundlePrice: bundle.bundlePrice ?? null, fullPrice: bundle.fullPrice ?? null }
    : { bundlePrice: null, fullPrice: null };
};

/** All three prices of a product, stored on cart lines so a region switch can re-price them. */
export const productPriceMap = (product) => ({
  EGP: productPriceIn(product, "EGP"),
  SAR: productPriceIn(product, "SAR"),
  AED: productPriceIn(product, "AED"),
});

export const bundlePriceMap = (bundle) => ({
  EGP: bundlePriceIn(bundle, "EGP").bundlePrice,
  SAR: bundlePriceIn(bundle, "SAR").bundlePrice,
  AED: bundlePriceIn(bundle, "AED").bundlePrice,
});
