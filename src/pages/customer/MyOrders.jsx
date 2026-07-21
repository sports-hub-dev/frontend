import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ordersApi } from "../../api/orders.api";
import { ROUTES } from "../../constants/routes";
import { usePagination } from "../../hooks/usePagination";
import OrderCard from "../../components/order/OrderCard";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";

const MyOrders = () => {
  const { page, limit, setPage } = usePagination(10);
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ordersApi
      .getMyOrders({ page, limit })
      .then(({ data }) => {
        setOrders(data.data);
        setMeta(data.meta);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [page, limit]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-2xl font-bold text-navy-900">My Orders</h1>

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && !orders.length && (
        <EmptyState
          title="No orders yet"
          description="Once you place an order, it will show up here."
          action={<Link to={ROUTES.PRODUCTS}><Button>Shop Products</Button></Link>}
        />
      )}

      {!loading && Boolean(orders.length) && (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <div key={order._id} className="animate-fadeUp" style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }}>
              <OrderCard order={order} />
            </div>
          ))}
          <div className="pt-4">
            <Pagination page={meta.page || page} totalPages={meta.totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
