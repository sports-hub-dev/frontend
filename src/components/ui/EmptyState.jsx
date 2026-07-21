import React from "react";
import { cn } from "../../utils/cn";

const EmptyState = ({ icon, title, description, action, className }) => (
  <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-white/60 px-6 py-16 text-center animate-fadeIn", className)}>
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-navy-50 text-navy-400">
      {icon || (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M3 7l1.5-3h15L21 7M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18M8 11h8"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
    <h4 className="font-display text-base font-semibold text-navy-900">{title}</h4>
    {description && <p className="mt-1.5 max-w-sm text-sm text-navy-400">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
