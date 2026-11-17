import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ordersApi } from "../../api/orders.api";
import { ROUTES } from "../../constants/routes";
import { formatPrice } from "../../utils/formatPrice";
import { formatOrderNumber } from "../../utils/orderNumber";
import { formatDateTime } from "../../utils/formatDate";
import { OrderStatusBadge } from "../../components/order/StatusBadge";
import Skeleton from "../../components/ui/Skeleton";

const STAGES = [
  { status: "pending", label: "Order placed" },
  { status: "confirmed", label: "Confirmed" },
  { status: "processing", label: "In production" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
];
const CLOSED = { cancelled: "This order was cancelled.", refunded: "This order was refunded." };

const Box = ({ size, delay }) => (
  <span className="sh-box" style={{ animationDelay: delay }}>
    <svg width={size} height={Math.round(size * 0.86)} viewBox="0 0 58 50" aria-hidden="true">
      <rect x="1" y="1" width="56" height="48" rx="4" fill="#C98A3A" />
      <rect x="23" y="1" width="12" height="48" fill="#E0A85C" />
      <rect x="8" y="30" width="16" height="10" rx="2" fill="#10192C" />
    </svg>
  </span>
);

const Truck = () => (
  <svg width="74" height="48" viewBox="0 0 74 48" aria-hidden="true">
    <rect x="2" y="6" width="44" height="28" rx="4" fill="#10192C" />
    <rect x="8" y="12" width="20" height="10" rx="2" fill="#F2A93B" />
    <path d="M46 14h14l10 10v10H46z" fill="#1E7FD8" />
    <rect x="52" y="17" width="8" height="7" rx="1" fill="#EEF1F7" />
    <circle className="sh-wheel" cx="16" cy="38" r="7" fill="#141A24" stroke="#B9C0CC" strokeWidth="2" strokeDasharray="4 3" />
    <circle className="sh-wheel" cx="58" cy="38" r="7" fill="#141A24" stroke="#B9C0CC" strokeWidth="2" strokeDasharray="4 3" />
  </svg>
);

/** Latest timestamp the order entered a given status, from its timeline. */
const reachedAt = (timeline = [], status) => {
  const hits = timeline.filter((t) => t.newStatus === status);
  return hits.length ? hits[hits.length - 1].timestamp : null;
};

const Progress = ({ order }) => {
  const current = Math.max(0, STAGES.findIndex((s) => s.status === order.status));
  const pct = (current / (STAGES.length - 1)) * 100;
  return (
    <>
      <div className="relative h-[70px]">
        <div className="absolute inset-x-0 top-[50px] h-2 rounded bg-navy-100" />
        <div className="sh-fill absolute left-0 top-[50px] h-2 rounded bg-amber" style={{ "--to": `${pct}%` }} />
        <div className="sh-truck absolute top-0 -translate-x-1/2" style={{ "--to": `${pct}%` }}>
          <Truck />
        </div>
      </div>
      <ol className="grid grid-cols-2 gap-5 sm:grid-cols-5">
        {STAGES.map((stage, i) => {
          const done = i < current;
          const isNow = i === current;
          const at = reachedAt(order.timeline, stage.status) || (i === 0 ? order.createdAt : null);
          return (
            <li key={stage.status} className="flex flex-col gap-2.5">
              <span
                className={`sh-node flex h-10 w-10 items-center justify-center rounded-full text-[15px] font-bold ${
                  done ? "bg-navy-900 text-white" : isNow ? "sh-current bg-amber text-navy-900" : "bg-navy-100 text-navy-500"
                }`}
                style={{ animationDelay: `${0.3 + i * 0.4}s` }}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className="text-base font-semibold text-navy-900">{stage.label}</span>
              <span className="text-[13px] text-navy-500">
                {at && (done || isNow) ? formatDateTime(at) : isNow ? "In progress" : "Pending"}
              </span>
            </li>
          );
        })}
      </ol>
    </>
  );
};

const TrackOrder = () => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);
  const [runKey, setRunKey] = useState(0);

  const { register, handleSubmit } = useForm();

  const onSubmit = async ({ orderNumber }) => {
    if (!orderNumber?.trim()) {
      setError("Enter an order number to see its status.");
      setOrder(null);
      setShake((n) => n + 1);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await ordersApi.trackOrder(orderNumber.trim().toUpperCase());
      setOrder(data.data.order);
      setRunKey((n) => n + 1);
    } catch (err) {
      setOrder(null);
      setError(err.response?.data?.message || "Order not found. Double-check the order number and try again.");
      setShake((n) => n + 1);
    } finally {
      setLoading(false);
    }
  };

  const closedNote = order && CLOSED[order.status];

  return (
    <div className="bg-navy-ink text-white">
      {/* ── Search hero with conveyor belt ──────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-36 pt-24 text-center sm:px-8">
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-5">
          <p className="sh-rise text-[13px] font-semibold uppercase tracking-[0.22em] text-amber">Order Status</p>
          <h1 className="sh-rise font-editorial text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl" style={{ "--sh-step": "0.1s" }}>
            Track your order
          </h1>
          <p className="sh-rise text-lg text-navy-100" style={{ "--sh-step": "0.2s" }}>
            Enter your order number, e.g. SH240115-12345
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="sh-rise mt-2 w-full max-w-xl" style={{ "--sh-step": "0.3s" }} noValidate>
            <div key={shake} className={`flex gap-2 rounded-full border-[1.5px] border-navy-500 bg-navy-900 p-2 ${shake ? "sh-shake" : ""}`}>
              <label htmlFor="order-number" className="sr-only">Order number</label>
              <input
                id="order-number"
                placeholder="SH240115-12345"
                autoComplete="off"
                className="tracking-code min-w-0 flex-1 bg-transparent px-4 text-[17px] text-white placeholder:text-navy-400 focus:outline-none"
                {...register("orderNumber")}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-transition min-h-[52px] rounded-full bg-amber px-8 text-base font-bold text-navy-900 hover:bg-amber-300 disabled:opacity-60"
              >
                {loading ? "Tracking…" : "Track"}
              </button>
            </div>
            {error && <p className="mt-3 text-sm text-amber-300" role="alert">{error}</p>}
          </form>
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[90px]">
          <div className="sh-belt absolute inset-x-0 bottom-0 h-[18px]" />
          <Box size={58} delay="0s" />
          <Box size={46} delay="-3s" />
          <Box size={64} delay="-6s" />
        </div>
      </section>

      {/* ── Result / help ───────────────────────────────────────────────── */}
      <section className="bg-navy-50 px-6 pb-28 pt-20 text-navy-900 sm:px-8">
        <div className="mx-auto max-w-5xl">
          {loading && (
            <div className="space-y-4 rounded-[28px] bg-white p-10">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}

          {!loading && order && (
            <div key={runKey} className="flex flex-col gap-11 rounded-[28px] bg-white p-7 shadow-lift sm:p-11">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">Order</span>
                  <span className="tracking-code font-editorial text-3xl font-semibold sm:text-4xl">{formatOrderNumber(order.orderNumber)}</span>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <OrderStatusBadge status={order.status} />
                  <span className="font-mono text-sm text-navy-500">Total: {formatPrice(order.total)}</span>
                </div>
              </div>

              {closedNote ? (
                <div className="rounded-2xl border border-navy-100 bg-navy-50 px-6 py-5 text-base text-navy-700">
                  {closedNote}{" "}
                  <Link to={ROUTES.CONTACT} className="font-semibold text-navy-900 underline">Contact us</Link> if you have questions.
                </div>
              ) : (
                <Progress order={order} />
              )}

              {order.shippingAddress?.city && (
                <p className="text-sm text-navy-500">
                  Delivering to <span className="font-semibold text-navy-900">{order.shippingAddress.city}</span>
                </p>
              )}
            </div>
          )}

          {!loading && !order && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="flex flex-col gap-2.5 rounded-[22px] bg-white p-7">
                <span className="font-editorial text-5xl font-semibold">1</span>
                <h2 className="text-lg font-semibold">Find your order number</h2>
                <p className="text-[15px] leading-relaxed text-navy-500">It's in your order confirmation email and starts with SH.</p>
              </div>
              <div className="flex flex-col gap-2.5 rounded-[22px] bg-white p-7">
                <span className="font-editorial text-5xl font-semibold">2</span>
                <h2 className="text-lg font-semibold">Enter it above</h2>
                <p className="text-[15px] leading-relaxed text-navy-500">We show every stage from confirmation to your door.</p>
              </div>
              <div className="flex flex-col gap-2.5 rounded-[22px] bg-navy-900 p-7 text-white">
                <span className="font-editorial text-5xl font-semibold text-amber">?</span>
                <h2 className="text-lg font-semibold">Can't find it?</h2>
                <p className="text-[15px] leading-relaxed text-navy-100">Our team can look it up for you.</p>
                <Link to={ROUTES.CONTACT} className="text-[15px] font-semibold text-amber hover:text-amber-300">Contact us →</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TrackOrder;
