import React from "react";
import { createPortal } from "react-dom";

const PaymobIframe = ({ iframeUrl, onClose }) => {
  if (!iframeUrl) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col bg-navy-ink/70 backdrop-blur-sm animate-fadeIn">
      <div className="flex items-center justify-between bg-navy-900 px-4 py-3 sm:px-6">
        <span className="font-display text-sm font-semibold text-white">Complete your payment</span>
        <button onClick={onClose} aria-label="Close payment window" className="btn-transition rounded-full p-1.5 text-navy-300 hover:bg-white/10 hover:text-white">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="flex-1 animate-scaleIn bg-white">
        <iframe title="Paymob Checkout" src={iframeUrl} className="h-full w-full border-0" />
      </div>
    </div>,
    document.body
  );
};

export default PaymobIframe;