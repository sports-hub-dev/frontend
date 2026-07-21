import React from "react";
import { formatPrice } from "../../utils/formatPrice";
import { resolveImageUrl } from "../../utils/resolveImageUrl";
import { useCart } from "../../hooks/useCart";

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex animate-fadeUp gap-4 border-b border-navy-100 py-5 last:border-0">
      <img src={resolveImageUrl(item.mainImage)} alt={item.name} className="h-20 w-20 shrink-0 rounded-lg object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-navy-900">{item.name}</p>
            {item.size && <p className="mt-0.5 text-xs text-navy-400">Size: {item.size}</p>}
            <p className="mt-1 font-mono text-sm text-navy-700">{formatPrice(item.price)}</p>
          </div>
          <button
            onClick={() => removeItem({ productId: item.productId, size: item.size })}
            aria-label="Remove item"
            className="btn-transition shrink-0 rounded-lg p-1.5 text-navy-300 hover:bg-safety-redLight hover:text-safety-red"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => updateQuantity({ productId: item.productId, size: item.size, quantity: item.quantity - 1 })}
            className="btn-transition h-7 w-7 rounded-md border border-navy-200 text-navy-700 hover:bg-navy-50"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <button
            onClick={() => updateQuantity({ productId: item.productId, size: item.size, quantity: item.quantity + 1 })}
            className="btn-transition h-7 w-7 rounded-md border border-navy-200 text-navy-700 hover:bg-navy-50"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
