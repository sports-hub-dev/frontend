import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ordersApi } from "../../api/orders.api";
import { formatPrice } from "../../utils/formatPrice";
import { formatOrderNumber } from "../../utils/orderNumber";
import { OrderStatusBadge } from "../../components/order/StatusBadge";
import OrderTimeline from "../../components/order/OrderTimeline";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";

const TrackOrder = () => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const { register, handleSubmit } = useForm();

  const onSubmit = async ({ orderNumber }) => {
    if (!orderNumber?.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const { data } = await ordersApi.trackOrder(orderNumber.trim().toUpperCase());
      setOrder(data.data.order);
    } catch (err) {
      setOrder(null);
      setError(err.response?.data?.message || "Order not found. Double-check the order number and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="animate-fadeUp text-center">
        <h1 className="font-display text-2xl font-bold text-navy-900">Track your order</h1>
        <p className="mt-2 text-sm text-navy-400">Enter your order number, e.g. SH240115-12345</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex animate-fadeUp gap-2" style={{ animationDelay: "80ms" }}>
        <Input
          placeholder="SH240115-12345"
          containerClassName="flex-1"
          className="tracking-code"
          {...register("orderNumber")}
        />
        <Button type="submit" loading={loading} size="lg">Track</Button>
      </form>

      {loading && (
        <div className="mt-8 space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {!loading && error && (
        <div className="mt-8 animate-slideDown rounded-lg border border-safety-red/20 bg-safety-redLight px-4 py-3 text-sm text-safety-red">
          {error}
        </div>
      )}

      {!loading && order && (
        <div className="mt-8 animate-fadeUp rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="tracking-code text-lg font-semibold text-navy-900">{formatOrderNumber(order.orderNumber)}</p>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 font-mono text-sm text-navy-500">Total: {formatPrice(order.total)}</p>

          <div className="manifest-rule my-6" />

          <h3 className="mb-4 text-sm font-semibold text-navy-900">Status Timeline</h3>
          <OrderTimeline timeline={order.timeline} />

          {order.shippingAddress && (
            <>
              <div className="manifest-rule my-6" />
              <h3 className="mb-2 text-sm font-semibold text-navy-900">Shipping Address</h3>
              <p className="text-sm text-navy-600">
                {order.shippingAddress.fullName} · {order.shippingAddress.phoneNumber}
                <br />
                {order.shippingAddress.street}, {order.shippingAddress.area}, {order.shippingAddress.city}
              </p>
            </>
          )}
        </div>
      )}

      {!loading && !order && !error && searched === false && null}
    </div>
  );
};

export default TrackOrder;
