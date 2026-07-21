import React, { useState } from "react";
import toast from "react-hot-toast";
import { ordersApi } from "../../api/orders.api";
import Modal from "../ui/Modal";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import { formatPrice } from "../../utils/formatPrice";
import { formatOrderNumber } from "../../utils/orderNumber";
import { ORDER_STATUS_LABELS } from "../../constants/orderStatus";
import { OrderStatusBadge, PaymentStatusBadge } from "../order/StatusBadge";
import OrderTimeline from "../order/OrderTimeline";

const STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label }));

const AdminOrderModal = ({ open, onClose, order, onUpdated }) => {
  const [status, setStatus] = useState(order?.status || "pending");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  if (!order) return null;

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await ordersApi.updateOrderStatus(order._id, { status, notes: notes || undefined });
      toast.success("Order status updated");
      onUpdated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't update order status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={formatOrderNumber(order.orderNumber)} size="lg">
      <div className="flex flex-wrap items-center gap-2">
        <OrderStatusBadge status={order.status} />
        <PaymentStatusBadge status={order.paymentStatus} />
      </div>

      <div className="manifest-rule my-4" />

      <p className="mb-2 text-sm font-semibold text-navy-900">Customer</p>
      <p className="text-sm text-navy-600">{order.customerInfo?.name} · {order.customerInfo?.email} · {order.customerInfo?.phone}</p>

      <div className="manifest-rule my-4" />

      <p className="mb-2 text-sm font-semibold text-navy-900">Items</p>
      <div className="space-y-2">
        {order.items?.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-navy-600">{item.name} {item.size && `(${item.size})`} × {item.quantity}</span>
            <span className="font-mono text-navy-900">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="manifest-rule my-4" />

      <div className="flex justify-between text-sm font-semibold text-navy-900">
        <span>Total</span>
        <span className="font-mono">{formatPrice(order.total)}</span>
      </div>

      <div className="manifest-rule my-4" />

      <p className="mb-2 text-sm font-semibold text-navy-900">Update Status</p>
      <div className="space-y-3">
        <Select value={status} onChange={(e) => setStatus(e.target.value)} options={STATUS_OPTIONS} />
        <Textarea placeholder="Optional note about this update" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Button onClick={handleUpdate} loading={saving} className="w-full">Update Status</Button>
      </div>

      <div className="manifest-rule my-4" />
      <p className="mb-3 text-sm font-semibold text-navy-900">Timeline</p>
      <OrderTimeline timeline={order.timeline} />
    </Modal>
  );
};

export default AdminOrderModal;
