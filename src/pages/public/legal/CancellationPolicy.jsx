import React from "react";
import LegalPageLayout from "./LegalPageLayout";

const CancellationPolicy = () => (
  <LegalPageLayout title="Cancellation &amp; Replacement Policy" effectiveDate="[DD Month YYYY]">
    <h2>1. Cancelling Before Dispatch</h2>
    <p>
      You may cancel an order at no charge as long as it has not yet been marked "Shipped." Contact us via our{" "}
      <a href="/contact" className="text-navy-900 underline">Contact page</a> with your order number to request cancellation. [Confirm whether cancellation is also self-service from "My Orders" and any cut-off window.]
    </p>

    <h2>2. Cancelling After Dispatch</h2>
    <p>Once an order has shipped, it cannot be cancelled — you may instead request a return under our <a href="/refund-policy" className="text-navy-900 underline">Refund Policy</a> once it's delivered.</p>

    <h2>3. Size &amp; Replacement Requests</h2>
    <p>If a delivered item doesn't fit or was mis-shipped, you may request a replacement within [X days] of delivery, provided the item is unused, unwashed, and in its original packaging with tags attached. [Confirm which product categories — e.g. safety footwear, helmets — are excluded from replacement for hygiene/safety reasons.]</p>

    <h2>4. Non-Cancellable / Non-Replaceable Items</h2>
    <ul>
      <li>Vendor-exclusive bulk orders placed on behalf of a DSP company [confirm]</li>
      <li>Items marked as final sale or clearance [confirm if this category exists]</li>
      <li>[List any other exclusions specific to your operations]</li>
    </ul>

    <h2>5. How to Request a Cancellation or Replacement</h2>
    <p>Contact us via our <a href="/contact" className="text-navy-900 underline">Contact page</a> with your order number and the reason for your request. We'll confirm eligibility and next steps by email.</p>
  </LegalPageLayout>
);

export default CancellationPolicy;