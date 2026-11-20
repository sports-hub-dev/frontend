import React from "react";
import { Link } from "react-router-dom";
import { useRegion } from "../../hooks/useRegion";
import { bundlePriceIn } from "../../constants/regions";
import { resolveImageUrl } from "../../utils/resolveImageUrl";
import { buildRoute, ROUTES } from "../../constants/routes";
import Badge from "../ui/Badge";

const BundleCard = ({ bundle }) => {
  const { currency, money } = useRegion();
  const { bundlePrice, fullPrice } = bundlePriceIn(bundle, currency);
  return (
  <Link
    to={buildRoute(ROUTES.BUNDLE_DETAIL, { id: bundle._id })}
    className="block overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
  >
    <div className="relative aspect-square overflow-hidden bg-navy-50">
      {bundle.mainImage && <img src={resolveImageUrl(bundle.mainImage)} alt={bundle.name} className="h-full w-full object-cover" />}
      <span className="absolute left-3 top-3">
        <Badge tone="warning">{bundle.discountPercentage}% OFF</Badge>
      </span>
    </div>
    <div className="p-4">
      <h3 className="font-display text-sm font-semibold text-navy-900">{bundle.name}</h3>
      {bundle.description && <p className="mt-1 line-clamp-2 text-xs text-navy-400">{bundle.description}</p>}
      <p className="mt-2 text-xs text-navy-400">{bundle.products?.length} items included</p>
      <div className="mt-2 flex items-baseline gap-2">
        {bundlePrice === null ? (
          <span className="text-xs font-medium text-navy-400">Not sold in your region</span>
        ) : (
          <>
            <span className="font-mono text-base font-semibold text-navy-900">{money(bundlePrice)}</span>
            {fullPrice > bundlePrice && <span className="font-mono text-xs text-navy-400 line-through">{money(fullPrice)}</span>}
          </>
        )}
      </div>
    </div>
  </Link>
  );
};

export default BundleCard;