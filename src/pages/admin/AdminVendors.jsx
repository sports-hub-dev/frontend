import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { vendorsApi } from "../../api/vendors.api";
import { usePagination } from "../../hooks/usePagination";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Pagination from "../../components/ui/Pagination";
import VendorFormModal from "../../components/admin/VendorFormModal";
import { cn } from "../../utils/cn";

const VendorExpandedDetail = ({ vendorId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([vendorsApi.getVendorUsers(vendorId, { limit: 5 }), vendorsApi.getVendorProducts(vendorId, { limit: 5 })])
      .then(([usersRes, productsRes]) => setData({ users: usersRes.data.data, products: productsRes.data.data }))
      .catch(() => setData({ users: [], products: [] }));
  }, [vendorId]);

  if (!data) return <div className="p-4"><Skeleton className="h-16 w-full" /></div>;

  return (
    <div className="grid grid-cols-1 gap-6 bg-navy-50 p-5 sm:grid-cols-2">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-500">Recent Users</p>
        {data.users.length ? (
          <ul className="space-y-1.5 text-sm text-navy-700">
            {data.users.map((u) => <li key={u._id}>{u.firstName} {u.lastName} — {u.email}</li>)}
          </ul>
        ) : (
          <p className="text-sm text-navy-400">No users yet.</p>
        )}
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-500">Recent Products</p>
        {data.products.length ? (
          <ul className="space-y-1.5 text-sm text-navy-700">
            {data.products.map((p) => <li key={p._id}>{p.name}</li>)}
          </ul>
        ) : (
          <p className="text-sm text-navy-400">No products yet.</p>
        )}
      </div>
    </div>
  );
};

const AdminVendors = () => {
  const { page, limit, setPage } = usePagination(10);
  const [vendors, setVendors] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [formModal, setFormModal] = useState({ open: false, vendor: null });
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [toggling, setToggling] = useState(false);

  const loadVendors = () => {
    setLoading(true);
    vendorsApi
      .getAllVendors({ page, limit })
      .then(({ data }) => {
        setVendors(data.data);
        setMeta(data.meta);
      })
      .catch(() => setVendors([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadVendors, [page, limit]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleStatus = async () => {
    setToggling(true);
    try {
      await vendorsApi.toggleVendorStatus(suspendTarget._id);
      toast.success(`Vendor ${suspendTarget.isActive ? "suspended" : "reactivated"}`);
      setSuspendTarget(null);
      loadVendors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't update vendor status");
    } finally {
      setToggling(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-navy-900">DSP Vendors</h1>
        <Button onClick={() => setFormModal({ open: true, vendor: null })}>+ New Vendor</Button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
      ) : !vendors.length ? (
        <EmptyState title="No vendors yet" description="Create your first DSP vendor company." />
      ) : (
        <div className="space-y-3">
          {vendors.map((v) => (
            <div key={v._id} className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
              <button
                onClick={() => setExpandedId(expandedId === v._id ? null : v._id)}
                className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-navy-900">{v.name}</p>
                    <Badge tone={v.isActive ? "success" : "danger"}>{v.isActive ? "Active" : "Suspended"}</Badge>
                  </div>
                  <p className="text-sm text-navy-400">{v.email} · Commission: {v.commissionRate}%</p>
                </div>
                <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="outline" onClick={() => setFormModal({ open: true, vendor: v })}>Edit</Button>
                  <Button size="sm" variant={v.isActive ? "danger" : "primary"} onClick={() => setSuspendTarget(v)}>
                    {v.isActive ? "Suspend" : "Reactivate"}
                  </Button>
                  <svg
                    className={cn("h-4 w-4 text-navy-400 transition-transform duration-200", expandedId === v._id && "rotate-180")}
                    viewBox="0 0 12 8" fill="none"
                  >
                    <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </div>
              </button>
              <div className={cn("grid transition-all duration-300 ease-out", expandedId === v._id ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">{expandedId === v._id && <VendorExpandedDetail vendorId={v._id} />}</div>
              </div>
            </div>
          ))}
          <div className="pt-2"><Pagination page={meta.page || page} totalPages={meta.totalPages} onPageChange={setPage} /></div>
        </div>
      )}

      <VendorFormModal open={formModal.open} vendor={formModal.vendor} onClose={() => setFormModal({ open: false, vendor: null })} onSaved={loadVendors} />

      <ConfirmDialog
        open={Boolean(suspendTarget)}
        onClose={() => setSuspendTarget(null)}
        onConfirm={handleToggleStatus}
        loading={toggling}
        title={suspendTarget?.isActive ? "Suspend this vendor?" : "Reactivate this vendor?"}
        description={suspendTarget?.isActive ? "Suspending will also deactivate all of this vendor's users." : "This vendor and its users will regain access."}
        confirmLabel={suspendTarget?.isActive ? "Suspend" : "Reactivate"}
        tone={suspendTarget?.isActive ? "danger" : "primary"}
      />
    </div>
  );
};

export default AdminVendors;
