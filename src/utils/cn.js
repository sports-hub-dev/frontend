/**
 * Lightweight className combiner — merges truthy class strings.
 * Usage: cn("base-class", isActive && "active-class", className)
 */
export const cn = (...classes) => classes.filter(Boolean).join(" ");
