import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { bundlesApi } from "../../api/bundles.api";
import { formatPrice } from "../../utils/formatPrice";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import BundleFormModal from "../../components/admin/BundleFormModal";

const AdminBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadBundles = () => {
    setLoading(true);
    bundlesApi.getBundles({ limit: 50 }).then(({ data }) => setBundles(data.data)).catch(() => setBundles([])).finally(() => setLoading(false));
  };

  useEffect(loadBundles, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await bundlesApi.deleteBundle(deleteTarget._id);
      toast.success("Bundle deleted");
      setDeleteTarget(null);
      loadBundles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't delete bundle");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-navy-900">Bundles</h1>
        <Button onClick={() => setFormOpen(true)}>+ New Bundle</Button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}</div>
      ) : !bundles.length ? (
        <EmptyState title="No bundles yet" description="Create your first product bundle." />
      ) : (
        <div className="space-y-3">
          {bundles.map((b) => (
            <div key={b._id} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-navy-900">{b.name}</p>
                  <p className="text-xs text-navy-400">{b.products?.length} products · {b.discountPercentage}% off</p>
                  <p className="mt-1 text-sm">
                    <span className="text-navy-400 line-through">{formatPrice(b.fullPrice)}</span>{" "}
                    <span className="font-mono font-semibold text-navy-900">{formatPrice(b.bundlePrice)}</span>
                  </p>
                </div>
                <Button size="sm" variant="danger" onClick={() => setDeleteTarget(b)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BundleFormModal open={formOpen} onClose={() => setFormOpen(false)} onSaved={loadBundles} />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this bundle?"
        confirmLabel="Delete"
      />
    </div>
  );
};

export default AdminBundles;