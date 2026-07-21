import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ordersApi } from "../../api/orders.api";
import { ROUTES } from "../../constants/routes";
import { formatPrice } from "../../utils/formatPrice";
import { formatDate, formatDateTime } from "../../utils/formatDate";
import { formatOrderNumber } from "../../utils/orderNumber";
import { resolveImageUrl } from "../../utils/resolveImageUrl";
import { OrderStatusBadge, PaymentStatusBadge } from "../../components/order/StatusBadge";
import OrderTimeline from "../../components/order/OrderTimeline";
import Skeleton from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";
import { useCart } from "../../hooks/useCart";

const PAYMENT_METHOD_LABELS = { aps: "Amazon Payment Services" };

const OrderDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isConfirmation = searchParams.get("payment") === "success";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();

  // Payment is only confirmed once we land here with ?payment=success (verified
  // server-side by the APS return handler) — this is the right moment to clear
  // the cart, since a failed/abandoned payment must leave the cart intact.
  useEffect(() => {
    if (isConfirmation) clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmation]);

  useEffect(() => {
    setLoading(true);
    ordersApi
      .getMyOrderById(id)
      .then(({ data }) => setOrder(data.data.order))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10 sm:px-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="font-display text-xl font-semibold text-navy-900">Order not found</h2>
        <Link to={ROUTES.MY_ORDERS} className="mt-4 inline-block text-sm font-medium text-navy-700 underline">
          Back to my orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {isConfirmation && (
        <div className="mb-8 animate-scaleIn rounded-2xl border border-safety-green/20 bg-safety-greenLight p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-safety-green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-display text-xl font-bold text-navy-900">Order confirmed!</h1>
          <p className="mt-1 text-sm text-safety-green">Thank you — your order has been placed successfully.</p>
        </div>
      )}

      <div className="animate-fadeUp rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="tracking-code text-lg font-semibold text-navy-900">{formatOrderNumber(order.orderNumber)}</p>
            <p className="text-xs text-navy-400">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>

        <div className="manifest-rule my-6" />

        <h3 className="mb-3 text-sm font-semibold text-navy-900">Items</h3>
        <div className="space-y-4">
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <img src={resolveImageUrl(item.mainImage)} alt={item.name} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-navy-900">{item.name}</p>
                <p className="text-xs text-navy-400">
                  {item.size && `Size: ${item.size} · `}Qty: {item.quantity}
                </p>
              </div>
              <p className="font-mono text-sm font-semibold text-navy-900">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="manifest-rule my-6" />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-navy-600">
            <span>Subtotal</span>
            <span className="font-mono">{formatPrice(order.subtotal)}</span>
          </div>
          {Boolean(order.discount) && (
            <div className="flex justify-between text-safety-green">
              <span>Discount</span>
              <span className="font-mono">−{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-navy-600">
            <span>Shipping</span>
            <span className="font-mono">{formatPrice(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between pt-2 text-base font-semibold text-navy-900">
            <span>Total</span>
            <span className="font-mono">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="manifest-rule my-6" />

        <h3 className="mb-3 text-sm font-semibold text-navy-900">Payment</h3>
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs text-navy-400">Method</p>
            <p className="mt-0.5 font-medium text-navy-900">{PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}</p>
          </div>
          <div>
            <p className="text-xs text-navy-400">Status</p>
            <p className="mt-0.5"><PaymentStatusBadge status={order.paymentStatus} /></p>
          </div>
          {order.paidAt && (
            <div>
              <p className="text-xs text-navy-400">Paid At</p>
              <p className="mt-0.5 font-medium text-navy-900">{formatDateTime(order.paidAt)}</p>
            </div>
          )}
        </div>

        <div className="manifest-rule my-6" />

        <h3 className="mb-3 text-sm font-semibold text-navy-900">Shipping Address</h3>
        <p className="text-sm leading-relaxed text-navy-600">
          {order.shippingAddress?.fullName} · {order.shippingAddress?.phoneNumber}
          <br />
          {order.shippingAddress?.street}
          {order.shippingAddress?.building && `, Building ${order.shippingAddress.building}`}
          {order.shippingAddress?.apartment && `, Apt ${order.shippingAddress.apartment}`}
          <br />
          {order.shippingAddress?.area}, {order.shippingAddress?.city}
        </p>

        <div className="manifest-rule my-6" />

        <h3 className="mb-3 text-sm font-semibold text-navy-900">Status Timeline</h3>
        <OrderTimeline timeline={order.timeline} />
      </div>

      {isConfirmation && (
        <div className="mt-6 text-center">
          <Link to={ROUTES.PRODUCTS}>
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
