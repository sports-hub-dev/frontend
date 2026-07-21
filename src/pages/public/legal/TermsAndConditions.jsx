import React from "react";
import LegalPageLayout from "./LegalPageLayout";

const TermsAndConditions = () => (
  <LegalPageLayout title="Terms &amp; Conditions" effectiveDate="[DD Month YYYY]">
    <p>These Terms &amp; Conditions ("Terms") govern your use of the Sports Hub website and your purchase of products through it. By placing an order, you agree to be bound by these Terms.</p>

    <h2>1. About Us</h2>
    <p>Sports Hub ("we", "us", "our") is a uniform and PPE retailer operating in [Egypt / legal entity name / registration number], serving customers and DSP vendor partners across Egypt.</p>

    <h2>2. Accounts</h2>
    <p>You must provide accurate information when registering. Vendor/DSP accounts require admin approval before orders can be placed. You are responsible for maintaining the confidentiality of your login credentials.</p>

    <h2>3. Products &amp; Pricing</h2>
    <ul>
      <li>All prices are listed in Egyptian Pounds (EGP) and include applicable taxes unless stated otherwise.</li>
      <li>We reserve the right to correct pricing or listing errors and to limit order quantities.</li>
      <li>Vendor-exclusive products are only available to approved users of that vendor.</li>
    </ul>

    <h2>4. Orders &amp; Payment</h2>
    <p>Orders are processed once payment is confirmed via Amazon Payment Services. An order confirmation does not guarantee product availability; we will notify you and issue a refund if an item cannot be fulfilled.</p>

    <h2>5. Delivery, Cancellation &amp; Refunds</h2>
    <p>
      Delivery timelines, cancellation rights, and refund eligibility are set out in our{" "}
      <a href="/delivery-policy" className="text-navy-900 underline">Delivery &amp; Shipping Policy</a>,{" "}
      <a href="/cancellation-policy" className="text-navy-900 underline">Cancellation &amp; Replacement Policy</a>, and{" "}
      <a href="/refund-policy" className="text-navy-900 underline">Refund Policy</a>, each of which forms part of these Terms.
    </p>

    <h2>6. Limitation of Liability</h2>
    <p>To the maximum extent permitted by law, Sports Hub is not liable for indirect or consequential losses arising from use of the website or products purchased through it. [Confirm limitation language against applicable Egyptian consumer protection law.]</p>

    <h2>7. Governing Law</h2>
    <p>These Terms are governed by the laws of the Arab Republic of Egypt. [Confirm with legal counsel.]</p>

    <h2>8. Contact</h2>
    <p>Questions about these Terms can be sent via our <a href="/contact" className="text-navy-900 underline">Contact page</a>.</p>
  </LegalPageLayout>
);

export default TermsAndConditions;