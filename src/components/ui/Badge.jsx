import React from "react";
import { cn } from "../../utils/cn";

/** Generic "stamp" style badge — the manifest/shipping-label motif used app-wide. */
const Badge = ({ children, className, tone = "neutral" }) => {
  const tones = {
    neutral: "bg-navy-50 text-navy-700 ring-1 ring-inset ring-navy-200",
    success: "bg-safety-greenLight text-safety-green ring-1 ring-inset ring-safety-green/30",
    warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
    danger: "bg-safety-redLight text-safety-red ring-1 ring-inset ring-safety-red/30",
  };
  return <span className={cn("stamp", tones[tone], className)}>{children}</span>;
};

export default Badge;
