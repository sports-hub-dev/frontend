import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { bundlesApi } from "../../api/bundles.api";
import { resolveImageUrl } from "../../utils/resolveImageUrl";
import { formatPrice } from "../../utils/formatPrice";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { ROUTES } from "../../constants/routes";
import SizeSelector from "../../components/product/SizeSelector";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";

const BundleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addItem } = useCart();

    const [bundle, setBundle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSizes, setSelectedSizes] = useState({}); // { [productId]: size }

    useEffect(() => {
        bundlesApi.getBundleById(id)
            .then(({ data }) => {
                console.log(data.data.bundle);
                setBundle(data.data.bundle);
            })
            .catch(() => setBundle(null))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="mt-4 h-40 w-full rounded-2xl" />
            </div>
        );
    }

    if (!bundle) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-20 text-center">
                <h2 className="font-display text-xl font-semibold text-navy-900">Bundle not found</h2>
                <Link to={ROUTES.BUNDLES} className="mt-4 inline-block text-sm font-medium text-navy-700 underline">
                    Back to bundles
                </Link>
            </div>
        );
    }

    const sizedComponents = bundle.products.filter((c) => c.product.hasSizeVariants);
    const allSizesSelected = sizedComponents.every((c) => selectedSizes[c.product._id]);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(`/bundles/${id}`)}`);
            return;
        }
        if (!allSizesSelected) {
            toast.error("Please select a size for every item that needs one");
            return;
        }
        addItem({
            bundleId: bundle._id,
            name: bundle.name,
            mainImage: bundle.mainImage,
            price: bundle.bundlePrice,
            quantity: 1,
            selections: sizedComponents.map((c) => ({ product: c.product._id, size: selectedSizes[c.product._id] })),
        });
        toast.success("Bundle added to cart");
    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
            <nav className="mb-6 text-sm text-navy-400">
                <Link to={ROUTES.BUNDLES} className="hover:text-navy-700">Bundles</Link>
                <span className="mx-2">/</span>
                <span className="text-navy-600">{bundle.name}</span>
            </nav>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                <div className="aspect-square overflow-hidden rounded-2xl bg-navy-50">
                    {bundle.mainImage && <img src={resolveImageUrl(bundle.mainImage)} alt={bundle.name} className="h-full w-full object-cover" />}
                </div>

                <div>
                    <h1 className="font-display text-2xl font-bold text-navy-900">{bundle.name}</h1>
                    {bundle.description && <p className="mt-2 text-sm text-navy-500">{bundle.description}</p>}
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="font-mono text-xl font-bold text-navy-900">{formatPrice(bundle.bundlePrice)}</span>
                        <span className="font-mono text-sm text-navy-400 line-through">{formatPrice(bundle.fullPrice)}</span>
                        <span className="stamp bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200">{bundle.discountPercentage}% OFF</span>
                    </div>

                    <div className="manifest-rule my-6" />

                    <h3 className="mb-4 text-sm font-semibold text-navy-900">Included Products</h3>
                    <div className="space-y-6">
                        {bundle.products.map((component) => (
                            <div key={component.product._id} className="flex gap-4">
                                <img
                                    src={resolveImageUrl(component.product.mainImage)}
                                    alt={component.product.name}
                                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-navy-900">{component.product.name}</p>
                                    <p className="text-xs text-navy-400">Qty: {component.quantity}</p>
                                    {component.product.hasSizeVariants && (
                                        <div className="mt-2">
                                            <SizeSelector
                                                variants={component.product.variants}
                                                selected={selectedSizes[component.product._id]}
                                                onSelect={(size) => setSelectedSizes((prev) => ({ ...prev, [component.product._id]: size }))}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button onClick={handleAddToCart} disabled={!allSizesSelected} size="lg" className="mt-6 w-full">
                        Add Bundle to Cart
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BundleDetail;