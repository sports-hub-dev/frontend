import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ErrorBoundary from "../components/ui/ErrorBoundary";

/** ProtectedRoute (auth + approval guard) wraps this layout at the router level. */
const CustomerLayout = () => {
  const location = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main key={location.pathname} className="page-enter flex-1 bg-paper">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
