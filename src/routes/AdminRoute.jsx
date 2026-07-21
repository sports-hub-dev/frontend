import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";
import Spinner from "../components/ui/Spinner";

/** Guards every page under /admin. Non-admins are redirected home immediately. */
const AdminRoute = () => {
  const { isAuthenticated, isAdmin, sessionChecked } = useAuth();

  if (!sessionChecked) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
