import React from "react";
import LegalPageLayout from "./LegalPageLayout";

const DeliveryPolicy = () => (
  <LegalPageLayout title="Delivery &amp; Shipping Policy" effectiveDate="[DD Month YYYY]">
    <h2>1. Delivery Areas</h2>
    <p>We currently deliver across [Egypt — list specific governorates/cities covered]. [Confirm Saudi Arabia / UAE coverage for direct consumer orders, if applicable, separate from bulk vendor production.]</p>

    <h2>2. Delivery Timeframes</h2>
    <ul>
      <li>Standard delivery: [X–Y business days] from order confirmation</li>
      <li>Vendor/bulk orders: [confirm separate timeline if applicable]</li>
      <li>Delivery times are estimates and may be affected by product availability, address accuracy, or courier delays</li>
    </ul>

    <h2>3. Shipping Fees</h2>
    <p>A shipping fee is calculated at checkout and shown in your order summary before payment. Shipping fees are non-refundable except where the order is cancelled or returned due to our error.</p>

    <h2>4. Order Tracking</h2>
    <p>Every order receives a unique order number (format: SH240115-12345). You can track its status at any time via our <a href="/track" className="text-navy-900 underline">Track Order</a> page, or from "My Orders" if logged in.</p>

    <h2>5. Failed Delivery Attempts</h2>
    <p>If delivery fails due to an incorrect address or unavailability at the delivery location, we will attempt to contact you to arrange redelivery. [Confirm redelivery fee policy, and maximum attempts before an order is returned to us / cancelled.]</p>

    <h2>6. Damaged or Missing Items</h2>
    <p>Please inspect your order upon delivery. Report any damage or missing items within [X days] via our{" "}<a href="/contact" className="text-navy-900 underline">Contact page</a>, referencing your order number.</p>
  </LegalPageLayout>
);

export default DeliveryPolicy;