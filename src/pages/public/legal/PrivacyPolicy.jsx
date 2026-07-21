import React from "react";
import LegalPageLayout from "./LegalPageLayout";

const PrivacyPolicy = () => (
  <LegalPageLayout title="Privacy Policy" effectiveDate="[DD Month YYYY]">
    <p>This Privacy Policy explains how Sports Hub collects, uses, and protects your personal data when you use our website or place an order.</p>

    <h2>1. Information We Collect</h2>
    <ul>
      <li>Account details: name, email, phone number, password (hashed)</li>
      <li>Order details: shipping address, order history, vendor affiliation (for DSP users)</li>
      <li>Payment data: processed directly by Amazon Payment Services — we do not store full card numbers</li>
      <li>Technical data: IP address, browser type, pages visited (for security and analytics)</li>
    </ul>

    <h2>2. How We Use Your Data</h2>
    <ul>
      <li>To process and deliver your orders</li>
      <li>To communicate order updates, approvals, and account notifications</li>
      <li>To prevent fraud and enforce our Terms</li>
      <li>To improve our products and website [confirm if any marketing use applies, and add opt-out details]</li>
    </ul>

    <h2>3. Who We Share Data With</h2>
    <p>We share the minimum necessary data with: Amazon Payment Services (to process payment), delivery/logistics partners (to fulfil your order), and vendor companies (only for orders placed by their own approved employees). We do not sell personal data to third parties.</p>

    <h2>4. Data Retention</h2>
    <p>We retain account and order data for as long as your account is active and as required to meet legal, tax, and accounting obligations. [Confirm specific retention periods.]</p>

    <h2>5. Your Rights</h2>
    <p>
      You may request access to, correction of, or deletion of your personal data by contacting us via our{" "}
      <a href="/contact" className="text-navy-900 underline">Contact page</a>. [Confirm specific rights under Egypt's Personal Data Protection Law No. 151/2020.]
    </p>

    <h2>6. Cookies</h2>
    <p>Our website uses essential cookies required for login sessions and cart functionality. [Add details of any analytics/marketing cookies if used, and a cookie consent mechanism if required.]</p>

    <h2>7. Contact</h2>
    <p>For privacy-related questions, reach us via our <a href="/contact" className="text-navy-900 underline">Contact page</a>.</p>
  </LegalPageLayout>
);

export default PrivacyPolicy;