import React from "react";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from "../../constants/orderStatus";
import { cn } from "../../utils/cn";

export const OrderStatusBadge = ({ status }) => (
  <span className={cn("stamp", ORDER_STATUS_COLORS[status] || ORDER_STATUS_COLORS.pending)}>
    {ORDER_STATUS_LABELS[status] || status}
  </span>
);

export const PaymentStatusBadge = ({ status }) => (
  <span className={cn("stamp", PAYMENT_STATUS_COLORS[status] || PAYMENT_STATUS_COLORS.pending)}>
    {PAYMENT_STATUS_LABELS[status] || status}
  </span>
);
