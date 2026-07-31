import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import { resolveImageUrl } from "../../utils/resolveImageUrl";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { ROUTES } from "../../constants/routes";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const BundleCard = ({ bundle }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addItem } = useCart();

    const handleAdd = () => {
        if (!isAuthenticated) {
            navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.HOME)}`);
            return;
        }
        addItem({
            bundleId: bundle._id,
            name: bundle.name,
            mainImage: bundle.mainImage,
            price: bundle.bundlePrice,
            quantity: 1,
        });
        toast.success("Bundle added to cart");
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
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
                    <span className="font-mono text-base font-semibold text-navy-900">{formatPrice(bundle.bundlePrice)}</span>
                    <span className="font-mono text-xs text-navy-400 line-through">{formatPrice(bundle.fullPrice)}</span>
                </div>
                <Button onClick={handleAdd} className="mt-3 w-full" size="sm">Add Bundle to Cart</Button>
            </div>
        </div>
    );
};

export default BundleCard;