import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { cn } from "../../utils/cn";
import logo from "../../assets/logo.png";

const Logo = ({ dark = false, className }) => (
  <Link to={ROUTES.HOME} className={cn("flex items-center", className)}>
    <img
      src={logo}
      alt="Sports Hub"
      className={cn("h-10 w-auto shrink-0 transition-opacity duration-200 hover:opacity-80", dark && "brightness-0 invert")}
    />
  </Link>
);

export default Logo;