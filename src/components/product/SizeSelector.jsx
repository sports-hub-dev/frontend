import React from "react";
import { cn } from "../../utils/cn";

const SizeSelector = ({ variants = [], selected, onSelect }) => (
  <div>
    <p className="mb-2.5 text-sm font-medium text-navy-900">Select size</p>
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => {
        const disabled = variant.stock <= 0 || variant.isActive === false;
        const isSelected = selected === variant.size;
        return (
          <button
            key={variant._id || variant.size}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(variant.size)}
            className={cn(
              "btn-transition relative min-w-[52px] rounded-lg border px-3.5 py-2 text-sm font-semibold",
              disabled
                ? "cursor-not-allowed border-navy-100 text-navy-300 line-through"
                : isSelected
                ? "border-navy-900 bg-navy-900 text-white"
                : "border-navy-200 text-navy-700 hover:border-navy-400"
            )}
            title={disabled ? "Out of stock" : `${variant.stock} in stock`}
          >
            {variant.size}
          </button>
        );
      })}
    </div>
  </div>
);

export default SizeSelector;
