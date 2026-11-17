import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { cn } from "../../utils/cn";
import logo from "../../assets/logo.png";
import logoWhite from "../../assets/logo-white-compact.png";
import logoWhiteFull from "../../assets/logo-white.png";

/**
 * variant:
 *  - "color" (default): original logo, for light backgrounds
 *  - "white": mark + wordmark in white, for the dark header
 *  - "full": white logo with the tagline, for the footer
 * `dark` is kept for existing callers and maps to "white".
 */
const SOURCES = { color: logo, white: logoWhite, full: logoWhiteFull };
const HEIGHTS = { color: "h-10", white: "h-12", full: "h-16" };

const Logo = ({ dark = false, variant, className }) => {
  const kind = variant || (dark ? "white" : "color");
  return (
    <Link to={ROUTES.HOME} className={cn("sh-logo flex items-center", className)}>
      <img src={SOURCES[kind]} alt="Sports Hub" className={cn("w-auto shrink-0", HEIGHTS[kind])} />
    </Link>
  );
};

export default Logo;
