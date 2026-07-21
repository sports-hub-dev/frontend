import React from "react";
import { cn } from "../../utils/cn";
import Spinner from "./Spinner";

const VARIANTS = {
  primary: "bg-navy-900 text-white hover:bg-navy-700 active:scale-[0.98] shadow-card",
  amber: "bg-amber text-navy-900 hover:bg-amber-500 active:scale-[0.98] shadow-card",
  outline: "border border-navy-200 text-navy-900 hover:bg-navy-50 active:scale-[0.98]",
  ghost: "text-navy-700 hover:bg-navy-50 active:scale-[0.98]",
  danger: "bg-safety-red text-white hover:bg-safety-red/90 active:scale-[0.98]",
  link: "text-navy-700 underline-offset-4 hover:underline p-0",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = React.forwardRef(
  ({ children, variant = "primary", size = "md", loading = false, disabled, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "btn-transition inline-flex items-center justify-center gap-2 rounded-lg font-semibold",
          "disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
          VARIANTS[variant],
          variant !== "link" && SIZES[size],
          className
        )}
        {...props}
      >
        {loading && <Spinner size="sm" light={variant === "primary" || variant === "danger"} />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
