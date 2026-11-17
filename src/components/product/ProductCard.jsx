import React from "react";
import { Link } from "react-router-dom";
import { buildRoute, ROUTES } from "../../constants/routes";
import { formatPrice } from "../../utils/formatPrice";
import StockBadge from "./StockBadge";

const ProductCard = ({ product }) => {
  const stock = product.totalStock ?? product.stock ?? 0;

  return (
    <Link
      to={buildRoute(ROUTES.PRODUCT_DETAIL, { id: product._id })}
      className="sh-pcard group flex h-full flex-col overflow-hidden rounded-[22px] border border-navy-100 bg-white"
    >
      <div className="relative aspect-square overflow-hidden bg-navy-50">
        <img
          src={product.mainImage}
          alt={product.name}
          loading="lazy"
          className="sh-pimg h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-navy-900">
          {product.category}
        </span>
        {!product.isPublic && (
          <span className="stamp absolute bottom-3 left-3 bg-navy-900/90 text-white backdrop-blur-sm">DSP Only</span>
        )}
        <div className="absolute right-3 top-3">
          <StockBadge stock={stock} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-2 min-h-[2.75rem] font-editorial text-lg font-semibold leading-snug text-navy-900">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="font-mono text-base font-semibold text-navy-900">{formatPrice(product.price)}</span>
          <span className="text-[13px] font-semibold text-amber-700 transition-transform duration-300 group-hover:translate-x-1">View →</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
