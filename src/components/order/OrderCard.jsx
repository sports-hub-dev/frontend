import React from "react";
import { Link } from "react-router-dom";
import { buildRoute, ROUTES } from "../../constants/routes";
import { formatPrice } from "../../utils/formatPrice";
import { formatDate } from "../../utils/formatDate";
import { formatOrderNumber } from "../../utils/orderNumber";
import { OrderStatusBadge, PaymentStatusBadge } from "./StatusBadge";

const OrderCard = ({ order }) => (
  <Link
    to={buildRoute(ROUTES.ORDER_DETAIL, { id: order._id })}
    className="btn-transition block rounded-2xl border border-navy-100 bg-white p-5 shadow-card hover:-translate-y-0.5 hover:shadow-lift"
  >
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="tracking-code text-sm font-semibold text-navy-900">{formatOrderNumber(order.orderNumber)}</p>
        <p className="mt-1 text-xs text-navy-400">{formatDate(order.createdAt)} · {order.items?.length || 0} item(s)</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <OrderStatusBadge status={order.status} />
        <PaymentStatusBadge status={order.paymentStatus} />
      </div>
    </div>
    <div className="manifest-rule mt-4 flex items-center justify-between pt-4">
      <span className="text-sm text-navy-500">Total</span>
      <span className="font-mono text-base font-semibold text-navy-900">{formatPrice(order.total)}</span>
    </div>
  </Link>
);

export default OrderCard;
