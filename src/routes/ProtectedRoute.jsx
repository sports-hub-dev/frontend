import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";
import Spinner from "../components/ui/Spinner";

/**
 * Guards customer-only pages. A user must be logged in AND approved.
 * Vendor users awaiting approval are bounced back to /login, where the
 * pending-approval message is shown again.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, user, sessionChecked } = useAuth();
  const location = useLocation();

  if (!sessionChecked) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${ROUTES.LOGIN}?redirect=${redirect}`} replace />;
  }

  if (user?.vendorId && !user?.isApproved) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
