import React, { useEffect, useState } from "react";
import { settingsApi } from "../../api/settings.api";
import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "../../hooks/useCart";
import Skeleton from "../ui/Skeleton";
import PromoCodeInput from "./PromoCodeInput";

/**
 * Shared order summary panel.
 * `readonly` hides the promo input (used on the checkout page, where the
 * cart contents are already locked in).
 */
const CartSummary = ({ children, readonly = false }) => {
  const { subtotal, promo } = useCart();
  const [shippingFee, setShippingFee] = useState(null);

  useEffect(() => {
    settingsApi
      .getShippingFee()
      .then(({ data }) => setShippingFee(data.data.shippingFee))
      .catch(() => setShippingFee(75));
  }, []);

  const discount = promo ? Math.round((subtotal * promo.discountPercentage) / 100) : 0;
  const total = Math.max(subtotal - discount, 0) + (shippingFee || 0);

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card sm:p-6">
      <h3 className="font-display text-base font-semibold text-navy-900">Order Summary</h3>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between text-navy-600">
          <span>Subtotal</span>
          <span className="font-mono">{formatPrice(subtotal)}</span>
        </div>
        {promo && (
          <div className="flex justify-between text-safety-green">
            <span>Discount ({promo.discountPercentage}%)</span>
            <span className="font-mono">−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-navy-600">
          <span>Shipping</span>
          {shippingFee === null ? <Skeleton className="h-4 w-16" /> : <span className="font-mono">{formatPrice(shippingFee)}</span>}
        </div>
      </div>
      <div className="manifest-rule mt-4 flex items-center justify-between pt-4">
        <span className="font-display text-sm font-semibold text-navy-900">Total</span>
        <span className="font-mono text-lg font-bold text-navy-900">{formatPrice(total)}</span>
      </div>
      {!readonly && (
        <div className="mt-5">
          <PromoCodeInput />
        </div>
      )}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
};

export default CartSummary;
