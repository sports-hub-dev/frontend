import React from "react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { cn } from "../../utils/cn";
import Logo from "./Logo";

const NAV_ITEMS = [
  { to: ROUTES.ADMIN_DASHBOARD, label: "Dashboard", end: true },
  { to: ROUTES.ADMIN_PRODUCTS, label: "Products" },
  { to: ROUTES.ADMIN_ORDERS, label: "Orders" },
  { to: ROUTES.ADMIN_USERS, label: "Users" },
  { to: ROUTES.ADMIN_VENDORS, label: "DSP Vendors" },
  { to: ROUTES.ADMIN_PROMO_CODES, label: "Promo Codes" },
  { to: ROUTES.ADMIN_FEEDBACK, label: "Feedback" },
  { to: ROUTES.ADMIN_SETTINGS, label: "Settings" },
  { to: ROUTES.ADMIN_CONTACT, label: "Contact Messages" },
];

const ICONS = {
  "Contact Messages": "M3 8l9 6 9-6M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8M3 8l9-5 9 5",
  Dashboard: "M3 12h4v8H3zM10 4h4v16h-4zM17 8h4v12h-4z",
  Products: "M3 7l1.5-3h15L21 7M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18M8 11h8",
  Orders: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h6",
  Users: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM3 21a7 7 0 0114 0M17 11a4 4 0 010 8M21 21a7 7 0 00-4-6.3",
  "DSP Vendors": "M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M3 7l9 4 9-4",
  "Promo Codes": "M20.6 12.6L12 21.2 2.8 12A2 2 0 012 10.6V4a2 2 0 012-2h6.6a2 2 0 011.4.6l8.6 8.6a2 2 0 010 2.8zM7.5 7.5h.01",
  Feedback: "M21 11.5a8.4 8.4 0 01-9 8.4A8.5 8.5 0 013 12a8.5 8.5 0 018.5-8.5A8.4 8.4 0 0121 11.5z",
  Settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
};

const SidebarLinks = ({ onNavigate }) => (
  <nav className="flex flex-1 flex-col gap-1 px-3">
    {NAV_ITEMS.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            "btn-transition flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
            isActive ? "bg-amber text-navy-900" : "text-navy-200 hover:bg-white/10 hover:text-white"
          )
        }
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d={ICONS[item.label]} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {item.label}
      </NavLink>
    ))}
  </nav>
);

const Sidebar = ({ mobileOpen, onClose }) => (
  <>
    {/* Desktop sidebar */}
    <aside className="hidden w-64 shrink-0 flex-col bg-navy-900 py-6 lg:flex">
      <div className="px-5 pb-6">
        <Logo dark />
      </div>
      <SidebarLinks />
      <div className="mt-auto px-5 pt-6">
        <p className="tracking-code text-[11px] text-navy-400">ADMIN CONSOLE · v2.2</p>
      </div>
    </aside>

    {/* Mobile drawer */}
    <div className={cn("fixed inset-0 z-40 lg:hidden", mobileOpen ? "pointer-events-auto" : "pointer-events-none")}>
      <div
        className={cn("absolute inset-0 bg-navy-ink/50 transition-opacity duration-300", mobileOpen ? "opacity-100" : "opacity-0")}
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute inset-y-0 left-0 flex w-72 flex-col bg-navy-900 py-6 shadow-lift transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 pb-6">
          <Logo dark />
          <button onClick={onClose} className="rounded-full p-1.5 text-navy-300 hover:bg-white/10" aria-label="Close menu">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <SidebarLinks onNavigate={onClose} />
      </aside>
    </div>
  </>
);

export default Sidebar;
