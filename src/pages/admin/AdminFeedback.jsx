import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { feedbackApi } from "../../api/feedback.api";
import { usePagination } from "../../hooks/usePagination";
import { formatDate } from "../../utils/formatDate";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const Stars = ({ rating }) => (
  <span className="text-amber-400" aria-label={`${rating} out of 5 stars`}>
    {"★".repeat(rating)}
    <span className="text-navy-200">{"★".repeat(5 - rating)}</span>
  </span>
);

const AdminFeedback = () => {
  const { page, limit, setPage } = usePagination(10);
  const [feedback, setFeedback] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadFeedback = () => {
    setLoading(true);
    feedbackApi
      .getAllFeedback({ page, limit, rating: ratingFilter || undefined })
      .then(({ data }) => {
        setFeedback(data.data);
        setMeta(data.meta);
      })
      .catch(() => setFeedback([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadFeedback, [page, limit, ratingFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await feedbackApi.deleteFeedback(deleteTarget._id);
      toast.success("Feedback deleted");
      setDeleteTarget(null);
      loadFeedback();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't delete feedback");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-navy-900">Feedback</h1>

      <div className="mb-5">
        <Select
          containerClassName="w-44"
          placeholder="All Ratings"
          value={ratingFilter}
          onChange={(e) => { setPage(1); setRatingFilter(e.target.value); }}
          options={[5, 4, 3, 2, 1].map((r) => ({ value: String(r), label: `${r} star${r > 1 ? "s" : ""}` }))}
        />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>
      ) : !feedback.length ? (
        <EmptyState title="No feedback yet" description="Customer feedback will appear here." />
      ) : (
        <>
          <div className="space-y-3">
            {feedback.map((f) => (
              <div key={f._id} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{f.name}</p>
                    <p className="text-xs text-navy-400">{f.email} · {formatDate(f.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Stars rating={f.rating} />
                    <Button size="sm" variant="danger" onClick={() => setDeleteTarget(f)}>Delete</Button>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-navy-600">{f.message}</p>
              </div>
            ))}
          </div>
          <div className="mt-6"><Pagination page={meta.page || page} totalPages={meta.totalPages} onPageChange={setPage} /></div>
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this feedback?"
        description="This action can't be undone."
        confirmLabel="Delete"
      />
    </div>
  );
};

export default AdminFeedback;
