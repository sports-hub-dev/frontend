import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";

const SIZES = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl", xl: "max-w-4xl" };

const Modal = ({ open, onClose, title, children, size = "md", footer }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 animate-fadeIn bg-navy-ink/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 w-full animate-scaleIn rounded-2xl bg-white shadow-lift",
          "max-h-[90vh] overflow-y-auto",
          SIZES[size]
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4 sm:px-6">
            <h3 className="font-display text-lg font-semibold text-navy-900">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Close"
              className="btn-transition rounded-full p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-900"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
        <div className="px-5 py-5 sm:px-6">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t border-navy-100 px-5 py-4 sm:px-6">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
