/**
 * Formats a numeric amount as Egyptian Pounds, e.g. 1250 -> "1,250 EGP"
 * Always use this helper — never render a raw number as a price.
 */
export const formatPrice = (amount, currency = "EGP") => {
  const value = Number(amount) || 0;
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
  return `${formatted} ${currency}`;
};
