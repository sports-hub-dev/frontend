import React from "react";
import { cn } from "../../utils/cn";

const Select = React.forwardRef(
  ({ label, error, options = [], placeholder, className, containerClassName, id, ...props }, ref) => {
    const selectId = id || props.name;
    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-navy-900">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "w-full appearance-none rounded-lg border bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22><path d=%22M1 1l5 5 5-5%22 stroke=%22%2310192C%22 stroke-width=%221.6%22 fill=%22none%22 fill-rule=%22evenodd%22/></svg>')] bg-[right_0.9rem_center] bg-no-repeat px-3.5 py-2.5 pr-9 text-sm text-ink transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-amber-400/60",
            error ? "border-safety-red" : "border-navy-200 focus:border-navy-400",
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 animate-slideDown text-xs font-medium text-safety-red">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
