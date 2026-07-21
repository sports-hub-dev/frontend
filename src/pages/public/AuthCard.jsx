import React from "react";
import Logo from "../../components/layout/Logo";

const AuthCard = ({ title, subtitle, children, wide = false }) => (
  <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-paper px-4 py-12">
    <div className={`w-full ${wide ? "max-w-xl" : "max-w-md"} animate-fadeUp`}>
      <div className="mb-8 text-center">
        <Logo className="justify-center" />
        <h1 className="mt-6 font-display text-2xl font-bold text-navy-900">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-navy-400">{subtitle}</p>}
      </div>
      <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">{children}</div>
    </div>
  </div>
);

export default AuthCard;
