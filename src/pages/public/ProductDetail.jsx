import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { productsApi } from "../../api/products.api";
import { ROUTES, buildRoute } from "../../constants/routes";
import { formatPrice } from "../../utils/formatPrice";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import StockBadge from "../../components/product/StockBadge";
import SizeSelector from "../../components/product/SizeSelector";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    productsApi
      .getProductById(id)
      .then(({ data }) => {
        const fetchedProduct = data.data.product;
        setProduct(fetchedProduct);
        if (fetchedProduct.hasSizeVariants) {
          const firstAvailable = fetchedProduct.variants?.find((v) => v.stock > 0);
          setSelectedSize(firstAvailable?.size || null);
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const availableStock = product?.hasSizeVariants
    ? product.variants?.find((v) => v.size === selectedSize)?.stock || 0
    : product?.stock || 0;

  const getId = (value) => (typeof value === "string" ? value : value?._id) || null;

  const productVendorId = getId(product?.vendorId);
  const userVendorId = getId(user?.vendorId);

  const isVendorRestricted = Boolean(productVendorId) && productVendorId !== userVendorId;
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(buildRoute(ROUTES.PRODUCT_DETAIL, { id }))}`);
      return;
    }
    if (isVendorRestricted) return; // extra safety net alongside the disabled button
    if (product.hasSizeVariants && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addItem({
      productId: product._id,
      name: product.name,
      mainImage: product.mainImage,
      size: selectedSize,
      price: product.price,
      quantity,
    });
    toast.success("Added to cart");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h2 className="font-display text-xl font-semibold text-navy-900">Product not found</h2>
        <Link to={ROUTES.PRODUCTS} className="mt-4 inline-block text-sm font-medium text-navy-700 underline">
          Back to all products
        </Link>
      </div>
    );
  }

  const images = [product.mainImage, ...(product.additionalImages || [])];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-navy-400">
        <Link to={ROUTES.PRODUCTS} className="hover:text-navy-700">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-navy-600">{product.category}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Gallery */}
        <div className="animate-fadeUp">
          <div className="aspect-square overflow-hidden rounded-2xl bg-navy-50">
            <img src={images[activeImage]} alt={product.name} className="h-full w-full object-cover transition-opacity duration-300" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`btn-transition h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${activeImage === i ? "border-navy-900" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="animate-fadeUp" style={{ animationDelay: "80ms" }}>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">{product.category}</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="font-mono text-2xl font-bold text-navy-900">{formatPrice(product.price)}</span>
            <StockBadge stock={availableStock} />
          </div>

          <p className="mt-5 text-sm leading-relaxed text-navy-600">{product.description}</p>

          {product.hasSizeVariants && (
            <div className="mt-6">
              <SizeSelector variants={product.variants} selected={selectedSize} onSelect={setSelectedSize} />
            </div>
          )}

          <div className="manifest-rule mt-6 pt-6">
            <p className="mb-2.5 text-sm font-medium text-navy-900">Quantity</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-navy-200">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="btn-transition px-3.5 py-2 text-navy-700 hover:bg-navy-50"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                  disabled={quantity >= availableStock}
                  className="btn-transition px-3.5 py-2 text-navy-700 hover:bg-navy-50 disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={availableStock <= 0 || (product.hasSizeVariants && !selectedSize) || isVendorRestricted}
                size="lg"
                className="flex-1"
              >
                {isVendorRestricted ? "Not Available to You" : availableStock <= 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              
            </div>
            {isVendorRestricted && (
              <p className="mt-3 text-sm font-medium text-safety-red">
                This product is exclusive to a specific vendor's employees.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
