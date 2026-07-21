import React from "react";
import { cn } from "../../utils/cn";

/** Reusable pagination control driven by meta.page / meta.totalPages. */
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const pages = [];
  const windowSize = 1;
  for (let p = 1; p <= totalPages; p += 1) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= windowSize) pages.push(p);
    else if (pages[pages.length - 1] !== "...") pages.push("...");
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 pt-2" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="btn-transition rounded-lg border border-navy-200 px-3 py-1.5 text-sm text-navy-700 hover:bg-navy-50 disabled:opacity-40"
      >
        Prev
      </button>
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-sm text-navy-300">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              "btn-transition h-9 min-w-[36px] rounded-lg px-2 text-sm font-medium",
              p === page ? "bg-navy-900 text-white" : "text-navy-700 hover:bg-navy-50"
            )}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="btn-transition rounded-lg border border-navy-200 px-3 py-1.5 text-sm text-navy-700 hover:bg-navy-50 disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
