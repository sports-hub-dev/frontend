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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-square overflow-hidden bg-navy-50">
        <img
          src={product.mainImage}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {!product.isPublic && (
          <span className="stamp absolute left-3 top-3 bg-navy-900/90 text-white backdrop-blur-sm">DSP Only</span>
        )}
        <div className="absolute right-3 top-3">
          <StockBadge stock={stock} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-navy-400">{product.category}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] font-display text-sm font-semibold text-navy-900">
          {product.name}
        </h3>
        <p className="mt-auto pt-2 font-mono text-base font-semibold text-navy-900">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;