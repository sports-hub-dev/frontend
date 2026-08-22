import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productsApi } from "../../api/products.api";
import { SPECIAL_VENDORS, getEntityId } from "../../constants/specialVendors";
import ProductGrid from "../../components/product/ProductGrid";

const VendorProducts = () => {
  const { vendorId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const vendor = SPECIAL_VENDORS.find((v) => v.id === vendorId);

  useEffect(() => {
    setLoading(true);
    productsApi
      .getProducts({ limit: 100 })
      .then(({ data }) => setProducts(data.data.filter((p) => getEntityId(p.vendorId) === vendorId)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [vendorId]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-2xl font-bold text-navy-900">{vendor?.name || "Vendor"} Products</h1>
      <ProductGrid products={products} loading={loading} emptyMessage="No products available yet." />
    </div>
  );
};

export default VendorProducts;