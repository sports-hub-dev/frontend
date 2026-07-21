import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import ErrorBoundary from "../components/ui/ErrorBoundary";

/** AdminRoute (role guard) wraps this layout at the router level. */
const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-navy-100 bg-white px-4 sm:px-6 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="btn-transition rounded-lg p-2 text-navy-700 hover:bg-navy-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <span className="font-display text-sm font-semibold text-navy-900">Admin Console</span>
        </header>
        <main key={location.pathname} className="page-enter flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
