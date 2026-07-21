import React from "react";
import Badge from "../ui/Badge";

/** In Stock / Low Stock (≤5) / Out of Stock, derived from a product's totalStock. */
const StockBadge = ({ stock }) => {
  if (stock <= 0) return <Badge tone="danger">Out of Stock</Badge>;
  if (stock <= 5) return <Badge tone="warning">Low Stock · {stock} left</Badge>;
  return <Badge tone="success">In Stock</Badge>;
};

export default StockBadge;
