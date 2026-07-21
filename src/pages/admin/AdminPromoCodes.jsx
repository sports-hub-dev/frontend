import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { promosApi } from "../../api/promos.api";
import { usePagination } from "../../hooks/usePagination";
import { formatDate } from "../../utils/formatDate";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const AdminPromoCodes = () => {
  const { page, limit, setPage } = usePagination(10);
  const [codes, setCodes] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const loadCodes = () => {
    setLoading(true);
    promosApi
      .getAllPromoCodes({ page, limit })
      .then(({ data }) => {
        setCodes(data.data);
        setMeta(data.meta);
      })
      .catch(() => setCodes([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadCodes, [page, limit]); // eslint-disable-line react-hooks/exhaustive-deps

  const onCreate = async (values) => {
    try {
      await promosApi.createPromoCode({
        code: values.code.toUpperCase(),
        discountPercentage: Number(values.discountPercentage),
        startDate: values.startDate,
        endDate: values.endDate,
        usageLimit: values.usageLimit ? Number(values.usageLimit) : undefined,
      });
      toast.success("Promo code created");
      reset();
      setCreateOpen(false);
      loadCodes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't create promo code");
    }
  };

  const handleToggle = async (code) => {
    try {
      await promosApi.togglePromoCode(code._id);
      toast.success(`${code.code} ${code.isActive ? "deactivated" : "activated"}`);
      loadCodes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't update promo code");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await promosApi.deletePromoCode(deleteTarget._id);
      toast.success("Promo code deleted");
      setDeleteTarget(null);
      loadCodes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't delete promo code");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-navy-900">Promo Codes</h1>
        <Button onClick={() => setCreateOpen(true)}>+ New Promo Code</Button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>
      ) : !codes.length ? (
        <EmptyState title="No promo codes yet" description="Create your first discount code." />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-navy-50 text-left text-xs font-semibold uppercase tracking-wide text-navy-500">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Discount</th>
                  <th className="px-4 py-3">Usage</th>
                  <th className="px-4 py-3">Valid Period</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {codes.map((c) => (
                  <tr key={c._id} className="transition-colors hover:bg-navy-50/50">
                    <td className="tracking-code px-4 py-3 font-semibold text-navy-900">{c.code}</td>
                    <td className="px-4 py-3 text-navy-600">{c.discountPercentage}%</td>
                    <td className="px-4 py-3 text-navy-500">{c.usageCount} / {c.usageLimit ?? "∞"}</td>
                    <td className="px-4 py-3 text-navy-500">{formatDate(c.startDate)} – {formatDate(c.endDate)}</td>
                    <td className="px-4 py-3"><Badge tone={c.isActive ? "success" : "neutral"}>{c.isActive ? "Active" : "Inactive"}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleToggle(c)}>{c.isActive ? "Deactivate" : "Activate"}</Button>
                        <Button size="sm" variant="danger" onClick={() => setDeleteTarget(c)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6"><Pagination page={meta.page || page} totalPages={meta.totalPages} onPageChange={setPage} /></div>
        </>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Promo Code">
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
          <Input label="Code" placeholder="SUMMER25" error={errors.code?.message} {...register("code", { required: "Code is required" })} />
          <Input label="Discount Percentage" type="number" min="1" max="100" error={errors.discountPercentage?.message} {...register("discountPercentage", { required: "Discount is required" })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" error={errors.startDate?.message} {...register("startDate", { required: "Start date is required" })} />
            <Input label="End Date" type="date" error={errors.endDate?.message} {...register("endDate", { required: "End date is required" })} />
          </div>
          <Input label="Usage Limit (optional)" type="number" min="1" {...register("usageLimit")} />
          <Button type="submit" loading={isSubmitting} className="w-full" size="lg">Create Promo Code</Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this promo code?"
        description="This action can't be undone."
        confirmLabel="Delete"
      />
    </div>
  );
};

export default AdminPromoCodes;
