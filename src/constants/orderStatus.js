export const ORDER_STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  confirmed: "bg-navy-50 text-navy-700 ring-1 ring-inset ring-navy-200",
  processing: "bg-navy-50 text-navy-700 ring-1 ring-inset ring-navy-200",
  shipped: "bg-safety-greenLight text-safety-green ring-1 ring-inset ring-safety-green/30",
  delivered: "bg-safety-greenLight text-safety-green ring-1 ring-inset ring-safety-green/30",
  cancelled: "bg-safety-redLight text-safety-red ring-1 ring-inset ring-safety-red/30",
};

export const PAYMENT_STATUS_LABELS = {
  pending: "Payment Pending",
  paid: "Paid",
  failed: "Payment Failed",
  refunded: "Refunded",
};

export const PAYMENT_STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  paid: "bg-safety-greenLight text-safety-green ring-1 ring-inset ring-safety-green/30",
  failed: "bg-safety-redLight text-safety-red ring-1 ring-inset ring-safety-red/30",
  refunded: "bg-navy-50 text-navy-700 ring-1 ring-inset ring-navy-200",
};

export const ORDER_STATUS_SEQUENCE = ["pending", "confirmed", "processing", "shipped", "delivered"];
