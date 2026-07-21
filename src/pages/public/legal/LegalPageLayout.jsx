import React from "react";

const LegalPageLayout = ({ title, effectiveDate, children }) => (
  <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
    <h1 className="font-display text-3xl font-bold text-navy-900">{title}</h1>
    <p className="mt-2 text-sm text-navy-400">Effective date: {effectiveDate}</p>
    <div className="manifest-rule my-6" />
    <div className="space-y-6 text-sm leading-relaxed text-navy-600 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-navy-900 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_strong]:font-semibold [&_strong]:text-navy-900">
      {children}
    </div>
  </div>
);

export default LegalPageLayout;