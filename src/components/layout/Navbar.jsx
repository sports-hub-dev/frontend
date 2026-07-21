import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { cn } from "../../utils/cn";
import Logo from "./Logo";
import toast from "react-hot-toast";

const NAV_LINKS = [
  { to: ROUTES.HOME, label: "Home" },
  { to: ROUTES.PRODUCTS, label: "Products" },
  { to: ROUTES.ABOUT, label: "About Us" },
  { to: ROUTES.CONTACT, label: "Contact" },
  { to: ROUTES.TRACK_ORDER, label: "Track Order" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, isPendingApproval, logout } = useAuth();
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    toast.success("Logged out successfully");
    navigate(ROUTES.HOME);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-all duration-300",
        scrolled ? "border-navy-100 bg-white/90 shadow-card backdrop-blur-md" : "border-transparent bg-white"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === ROUTES.HOME}
              className={({ isActive }) =>
                cn(
                  "btn-transition relative rounded-lg px-3.5 py-2 text-sm font-medium",
                  isActive ? "text-navy-900" : "text-navy-500 hover:text-navy-900"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-amber transition-transform duration-200 origin-left",
                      isActive ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Cart */}
          <button
            onClick={() => navigate(ROUTES.CART)}
            aria-label="View cart"
            className="btn-transition relative rounded-lg p-2.5 text-navy-700 hover:bg-navy-50"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-1.7 5H17M9 20a1 1 0 100-2 1 1 0 000 2zM17 20a1 1 0 100-2 1 1 0 000 2z"
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] animate-scaleIn items-center justify-center rounded-full bg-amber px-1 text-[10px] font-bold text-navy-900">
                {count}
              </span>
            )}
          </button>

          {/* User menu / auth links */}
          {isAuthenticated && !isPendingApproval ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="btn-transition flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-3 hover:bg-navy-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-white">
                  {user?.firstName?.[0]?.toUpperCase()}
                </span>
                <span className="hidden text-sm font-medium text-navy-900 sm:block">{user?.firstName}</span>
                <svg
                  className={cn("h-3.5 w-3.5 text-navy-400 transition-transform duration-200", userMenuOpen && "rotate-180")}
                  viewBox="0 0 12 8" fill="none"
                >
                  <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 origin-top-right animate-scaleIn rounded-xl border border-navy-100 bg-white py-1.5 shadow-lift">
                  {user?.role === "admin" && (
                    <NavLink to={ROUTES.ADMIN_DASHBOARD} className="block px-4 py-2 text-sm text-navy-700 hover:bg-navy-50">
                      Admin Panel
                    </NavLink>
                  )}
                  <NavLink to={ROUTES.MY_ORDERS} className="block px-4 py-2 text-sm text-navy-700 hover:bg-navy-50">
                    My Orders
                  </NavLink>
                  <NavLink to={ROUTES.PROFILE} className="block px-4 py-2 text-sm text-navy-700 hover:bg-navy-50">
                    Profile
                  </NavLink>
                  <div className="my-1 border-t border-navy-100" />
                  <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-sm text-safety-red hover:bg-safety-redLight">
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <NavLink to={ROUTES.LOGIN} className="btn-transition rounded-lg px-3.5 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50">
                Log in
              </NavLink>
              <NavLink to={ROUTES.REGISTER} className="btn-transition rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
                Sign up
              </NavLink>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            className="btn-transition rounded-lg p-2.5 text-navy-700 hover:bg-navy-50 md:hidden"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      <div
        className={cn(
          "overflow-hidden border-t border-navy-100 bg-white transition-[max-height] duration-300 ease-out md:hidden",
          mobileOpen ? "max-h-96" : "max-h-0 border-t-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === ROUTES.HOME}
              className={({ isActive }) =>
                cn("rounded-lg px-3.5 py-2.5 text-sm font-medium", isActive ? "bg-navy-50 text-navy-900" : "text-navy-600")
              }
            >
              {link.label}
            </NavLink>
          ))}
          {!isAuthenticated && (
            <div className="mt-2 flex gap-2 border-t border-navy-100 pt-3">
              <NavLink to={ROUTES.LOGIN} className="flex-1 rounded-lg border border-navy-200 px-3.5 py-2.5 text-center text-sm font-medium text-navy-700">
                Log in
              </NavLink>
              <NavLink to={ROUTES.REGISTER} className="flex-1 rounded-lg bg-navy-900 px-3.5 py-2.5 text-center text-sm font-semibold text-white">
                Sign up
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
