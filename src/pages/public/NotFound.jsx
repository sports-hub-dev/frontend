import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import Button from "../../components/ui/Button";

const NotFound = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
    <p className="tracking-code animate-fadeUp text-sm text-amber-600">ERROR · 404</p>
    <h1 className="mt-3 animate-fadeUp font-display text-4xl font-bold text-navy-900" style={{ animationDelay: "60ms" }}>
      Page not found
    </h1>
    <p className="mt-3 max-w-sm animate-fadeUp text-sm text-navy-400" style={{ animationDelay: "120ms" }}>
      The page you're looking for doesn't exist or may have moved.
    </p>
    <Link to={ROUTES.HOME} className="mt-7 animate-fadeUp" style={{ animationDelay: "180ms" }}>
      <Button size="lg">Back to Home</Button>
    </Link>
  </div>
);

export default NotFound;
