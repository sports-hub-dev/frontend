import React from "react";
import { cn } from "../../utils/cn";

const Textarea = React.forwardRef(({ label, error, className, containerClassName, id, ...props }, ref) => {
  const areaId = id || props.name;
  return (
    <div className={cn("w-full", containerClassName)}>
      {label && (
        <label htmlFor={areaId} className="mb-1.5 block text-sm font-medium text-navy-900">
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        ref={ref}
        rows={4}
        className={cn(
          "w-full resize-y rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink transition-colors duration-150",
          "placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-amber-400/60",
          error ? "border-safety-red" : "border-navy-200 focus:border-navy-400",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 animate-slideDown text-xs font-medium text-safety-red">{error}</p>}
    </div>
  );
});

Textarea.displayName = "Textarea";
export default Textarea;
