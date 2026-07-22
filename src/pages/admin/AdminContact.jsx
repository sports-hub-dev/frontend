import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { contactApi } from "../../api/contact.api";
import { usePagination } from "../../hooks/usePagination";
import { formatDate } from "../../utils/formatDate";
import Badge from "../../components/ui/Badge";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const AdminContact = () => {
  const { page, limit, setPage } = usePagination(10);
  const [messages, setMessages] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [readFilter, setReadFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [markingId, setMarkingId] = useState(null);

  const loadMessages = () => {
    setLoading(true);
    contactApi.getAllMessages({ page, limit, isRead: readFilter || undefined })
      .then(({ data }) => { setMessages(data.data); setMeta(data.meta); })
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadMessages, [page, limit, readFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMarkRead = async (message) => {
    setMarkingId(message._id);
    try { await contactApi.markAsRead(message._id); loadMessages(); }
    catch (err) { toast.error(err.response?.data?.message || "Couldn't update message"); }
    finally { setMarkingId(null); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await contactApi.deleteMessage(deleteTarget._id);
      toast.success("Message deleted");
      setDeleteTarget(null);
      loadMessages();
    } catch (err) { toast.error(err.response?.data?.message || "Couldn't delete message"); }
    finally { setDeleting(false); }
  };

  return (
    <div>
      <h1 className="text-center mb-6 mt-6 font-display text-2xl font-bold text-navy-900">Contact Messages</h1>
      <div className="mb-5">
        <Select containerClassName="w-44" placeholder="All Messages" value={readFilter}
          onChange={(e) => { setPage(1); setReadFilter(e.target.value); }}
          options={[{ value: "false", label: "Unread" }, { value: "true", label: "Read" }]} />
      </div>
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}</div>
      ) : !messages.length ? (
        <EmptyState title="No messages yet" description="Messages submitted through the Contact page will appear here." />
      ) : (
        <>
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m._id} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-navy-900">{m.name}</p>
                      {!m.isRead && <Badge tone="warning">Unread</Badge>}
                    </div>
                    <p className="text-xs text-navy-400">{m.email} · {formatDate(m.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!m.isRead && (
                      <Button size="sm" variant="outline" onClick={() => handleMarkRead(m)} loading={markingId === m._id}>Mark as Read</Button>
                    )}
                    <Button size="sm" variant="danger" onClick={() => setDeleteTarget(m)}>Delete</Button>
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium text-navy-900">{m.subject}</p>
                <p className="mt-1 text-sm leading-relaxed text-navy-600">{m.message}</p>
              </div>
            ))}
          </div>
          <div className="mt-6"><Pagination page={meta.page || page} totalPages={meta.totalPages} onPageChange={setPage} /></div>
        </>
      )}
      <ConfirmDialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        loading={deleting} title="Delete this message?" description="This action can't be undone." confirmLabel="Delete" />
    </div>
  );
};

export default AdminContact;