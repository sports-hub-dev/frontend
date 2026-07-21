import React from "react";
import { cn } from "../../utils/cn";

const Input = React.forwardRef(
  ({ label, error, hint, className, containerClassName, id, prefix, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-navy-900">
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-navy-400">
              {prefix}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink transition-colors duration-150",
              "placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-amber-400/60",
              error ? "border-safety-red focus:border-safety-red" : "border-navy-200 focus:border-navy-400",
              prefix && "pl-10",
              className
            )}
            {...props}
          />
        </div>
        {hint && !error && <p className="mt-1.5 text-xs text-navy-400">{hint}</p>}
        {error && <p className="mt-1.5 animate-slideDown text-xs font-medium text-safety-red">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
