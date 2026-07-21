import React, { useEffect, useState } from "react";
import { ordersApi } from "../../api/orders.api";
import { vendorsApi } from "../../api/vendors.api";
import { usePagination } from "../../hooks/usePagination";
import { formatPrice } from "../../utils/formatPrice";
import { formatDate } from "../../utils/formatDate";
import { formatOrderNumber } from "../../utils/orderNumber";
import { ORDER_STATUS_LABELS } from "../../constants/orderStatus";
import { OrderStatusBadge, PaymentStatusBadge } from "../../components/order/StatusBadge";
import Badge from "../../components/ui/Badge";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import AdminOrderModal from "../../components/admin/AdminOrderModal";

const STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label }));

const AdminOrders = () => {
  const { page, limit, setPage } = usePagination(10);
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [filters, setFilters] = useState({ status: "", vendorId: "", search: "" });
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    ordersApi
      .getAllOrders({ page, limit, status: filters.status || undefined, vendorId: filters.vendorId || undefined, search: filters.search || undefined })
      .then(({ data }) => {
        setOrders(data.data);
        setMeta(data.meta);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    vendorsApi.getAllVendors({ limit: 100 }).then(({ data }) => setVendors(data.data)).catch(() => setVendors([]));
  }, []);

  useEffect(loadOrders, [page, limit, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-navy-900">Orders</h1>

      <div className="mb-5 flex flex-wrap gap-3">
        <Input
          containerClassName="w-64"
          placeholder="Search order # or email"
          onChange={(e) => { setPage(1); setFilters((f) => ({ ...f, search: e.target.value })); }}
        />
        <Select
          containerClassName="w-44"
          placeholder="All Statuses"
          value={filters.status}
          onChange={(e) => { setPage(1); setFilters((f) => ({ ...f, status: e.target.value })); }}
          options={STATUS_OPTIONS}
        />
        <Select
          containerClassName="w-52"
          placeholder="All Vendors"
          value={filters.vendorId}
          onChange={(e) => { setPage(1); setFilters((f) => ({ ...f, vendorId: e.target.value })); }}
          options={vendors.map((v) => ({ value: v._id, label: v.name }))}
        />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
      ) : !orders.length ? (
        <EmptyState title="No orders found" description="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card lg:block">
            <table className="w-full text-sm">
              <thead className="bg-navy-50 text-left text-xs font-semibold uppercase tracking-wide text-navy-500">
                <tr>
                  <th className="px-4 py-3">Order #</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Vendor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {orders.map((o) => (
                  <tr key={o._id} onClick={() => setSelectedOrder(o)} className="cursor-pointer transition-colors hover:bg-navy-50/50">
                    <td className="tracking-code px-4 py-3 font-medium text-navy-900">{formatOrderNumber(o.orderNumber)}</td>
                    <td className="px-4 py-3 text-navy-600">{o.customerInfo?.name}</td>
                    <td className="px-4 py-3 text-navy-500">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-3 font-mono text-navy-900">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3"><PaymentStatusBadge status={o.paymentStatus} /></td>
                    <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                    <td className="px-4 py-3">{o.vendorId ? <Badge>{o.vendorId.name}</Badge> : <span className="text-navy-300">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 lg:hidden">
            {orders.map((o) => (
              <button
                key={o._id}
                onClick={() => setSelectedOrder(o)}
                className="w-full rounded-2xl border border-navy-100 bg-white p-4 text-left shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="tracking-code text-sm font-semibold text-navy-900">{formatOrderNumber(o.orderNumber)}</span>
                  <span className="font-mono text-sm text-navy-900">{formatPrice(o.total)}</span>
                </div>
                <p className="mt-1 text-xs text-navy-400">{o.customerInfo?.name} · {formatDate(o.createdAt)}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <OrderStatusBadge status={o.status} />
                  <PaymentStatusBadge status={o.paymentStatus} />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6"><Pagination page={meta.page || page} totalPages={meta.totalPages} onPageChange={setPage} /></div>
        </>
      )}

      <AdminOrderModal open={Boolean(selectedOrder)} order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdated={loadOrders} />
    </div>
  );
};

export default AdminOrders;
