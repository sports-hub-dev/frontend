import React from "react";
import Skeleton from "../ui/Skeleton";
import EmptyState from "../ui/EmptyState";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, loading, emptyMessage = "No products match your filters yet." }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-navy-100 bg-white">
            <Skeleton className="aspect-square w-full" rounded="rounded-none" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <EmptyState
        title="Nothing to show here"
        description={emptyMessage}
        icon={
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-4.3-4.3M19 11a8 8 0 11-16 0 8 8 0 0116 0z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {products.map((product, i) => (
        <div key={product._id} className="animate-fadeUp" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
