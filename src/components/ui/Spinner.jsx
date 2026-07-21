import React from "react";
import { cn } from "../../utils/cn";

const SIZES = { sm: "h-4 w-4 border-2", md: "h-6 w-6 border-2", lg: "h-9 w-9 border-[3px]" };

const Spinner = ({ size = "md", light = false, className }) => (
  <span
    role="status"
    aria-label="Loading"
    className={cn(
      "inline-block animate-spin rounded-full border-solid",
      light ? "border-white/30 border-t-white" : "border-navy-200 border-t-navy-900",
      SIZES[size],
      className
    )}
  />
);

export default Spinner;
