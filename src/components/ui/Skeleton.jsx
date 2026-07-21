import React from "react";
import { cn } from "../../utils/cn";

/** Simple shimmer block for custom loading layouts (cards, rows). */
const Skeleton = ({ className, rounded = "rounded-md" }) => (
  <div className={cn("skeleton-shimmer", rounded, className)} />
);

export default Skeleton;
