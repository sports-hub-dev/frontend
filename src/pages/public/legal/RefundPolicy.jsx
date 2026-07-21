import React from "react";
import LegalPageLayout from "./LegalPageLayout";

const RefundPolicy = () => (
  <LegalPageLayout title="Refund Policy" effectiveDate="[DD Month YYYY]">
    <h2>1. Eligibility</h2>
    <p>You may be eligible for a refund if:</p>
    <ul>
      <li>Your order was cancelled before dispatch</li>
      <li>Your order was lost or significantly delayed in transit</li>
      <li>You received a damaged, defective, or incorrect item</li>
      <li>A returned item is approved under our <a href="/cancellation-policy" className="text-navy-900 underline">Cancellation &amp; Replacement Policy</a></li>
    </ul>

    <h2>2. Refund Method</h2>
    <p>Approved refunds are issued to the original payment method via Amazon Payment Services. Refunds typically appear on your statement within [X–Y business days] of approval, depending on your bank/card issuer.</p>

    <h2>3. Non-Refundable Items</h2>
    <ul>
      <li>Shipping fees, except where the order was cancelled or returned due to our error</li>
      <li>Items excluded under our Cancellation &amp; Replacement Policy (e.g. hygiene/safety items once unsealed)</li>
      <li>[List any other exclusions specific to your operations]</li>
    </ul>

    <h2>4. How to Request a Refund</h2>
    <p>Contact us via our <a href="/contact" className="text-navy-900 underline">Contact page</a> with your order number and reason for the refund request. We aim to respond within [X business days].</p>

    <h2>5. Partial Refunds</h2>
    <p>Where only part of an order is affected (e.g. one item missing or damaged), a refund will be issued for that portion only, unless the entire order is affected.</p>
  </LegalPageLayout>
);

export default RefundPolicy;