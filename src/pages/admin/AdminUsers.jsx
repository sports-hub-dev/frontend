import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "../../api/admin.api";
import { vendorsApi } from "../../api/vendors.api";
import { usePagination } from "../../hooks/usePagination";
import { formatDate } from "../../utils/formatDate";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Modal from "../../components/ui/Modal";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import { cn } from "../../utils/cn";

const TABS = [
  { id: "all", label: "All Users" },
  { id: "pending", label: "Pending Vendor Users" },
];

const AdminUsers = () => {
  const [tab, setTab] = useState("all");
  const { page, limit, setPage } = usePagination(10);
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [filters, setFilters] = useState({ role: "", vendorId: "", search: "" });
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const loadUsers = () => {
    setLoading(true);
    const call =
      tab === "pending"
        ? adminApi.getPendingVendorUsers({ page, limit })
        : adminApi.getAllUsers({ page, limit, role: filters.role || undefined, vendorId: filters.vendorId || undefined, search: filters.search || undefined });

    call
      .then(({ data }) => {
        setUsers(data.data);
        setMeta(data.meta);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    vendorsApi.getAllVendors({ limit: 100 }).then(({ data }) => setVendors(data.data)).catch(() => setVendors([]));
  }, []);

  useEffect(loadUsers, [tab, page, limit, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApprove = async (user) => {
    setActionLoading(user._id);
    try {
      await adminApi.approveVendorUser(user._id);
      toast.success(`${user.firstName} approved`);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't approve user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    setActionLoading(rejectTarget._id);
    try {
      await adminApi.rejectVendorUser(rejectTarget._id, { reason: rejectReason });
      toast.success("Registration rejected");
      setRejectTarget(null);
      setRejectReason("");
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't reject user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (user) => {
    setActionLoading(user._id);
    try {
      await adminApi.toggleUserStatus(user._id);
      toast.success(`${user.firstName} ${user.isActive ? "deactivated" : "activated"}`);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't update user status");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-navy-900">Users</h1>

      <div className="mb-5 flex gap-1 border-b border-navy-100">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setPage(1); }}
            className={cn(
              "btn-transition relative px-4 py-2.5 text-sm font-medium",
              tab === t.id ? "text-navy-900" : "text-navy-400 hover:text-navy-700"
            )}
          >
            {t.label}
            {tab === t.id && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-amber" />}
          </button>
        ))}
      </div>

      {tab === "all" && (
        <div className="mb-5 flex flex-wrap gap-3">
          <Input containerClassName="w-64" placeholder="Search name or email" onChange={(e) => { setPage(1); setFilters((f) => ({ ...f, search: e.target.value })); }} />
          <Select containerClassName="w-40" placeholder="All Roles" value={filters.role} onChange={(e) => { setPage(1); setFilters((f) => ({ ...f, role: e.target.value })); }} options={[{ value: "customer", label: "Customer" }, { value: "admin", label: "Admin" }]} />
          <Select containerClassName="w-52" placeholder="All Vendors" value={filters.vendorId} onChange={(e) => { setPage(1); setFilters((f) => ({ ...f, vendorId: e.target.value })); }} options={vendors.map((v) => ({ value: v._id, label: v.name }))} />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
      ) : !users.length ? (
        <EmptyState title={tab === "pending" ? "No pending approvals" : "No users found"} description="Nothing to show right now." />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card lg:block">
            <table className="w-full text-sm">
              <thead className="bg-navy-50 text-left text-xs font-semibold uppercase tracking-wide text-navy-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Approval</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {users.map((u) => (
                  <tr key={u._id} className="transition-colors hover:bg-navy-50/50">
                    <td className="px-4 py-3 font-medium text-navy-900">{u.firstName} {u.lastName}</td>
                    <td className="px-4 py-3 text-navy-500">{u.email}</td>
                    <td className="px-4 py-3"><Badge tone={u.role === "admin" ? "warning" : "neutral"}>{u.role}</Badge></td>
                    <td className="px-4 py-3 text-navy-500">{u.vendorId?.name || "—"}</td>
                    <td className="px-4 py-3">
                      {u.vendorId ? <Badge tone={u.isApproved ? "success" : "warning"}>{u.isApproved ? "Approved" : "Pending"}</Badge> : <span className="text-navy-300">N/A</span>}
                    </td>
                    <td className="px-4 py-3"><Badge tone={u.isActive ? "success" : "danger"}>{u.isActive ? "Active" : "Inactive"}</Badge></td>
                    <td className="px-4 py-3 text-navy-500">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {u.vendorId && !u.isApproved ? (
                          <>
                            <Button size="sm" onClick={() => handleApprove(u)} loading={actionLoading === u._id}>Approve</Button>
                            <Button size="sm" variant="danger" onClick={() => setRejectTarget(u)}>Reject</Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleToggleStatus(u)} loading={actionLoading === u._id}>
                            {u.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 lg:hidden">
            {users.map((u) => (
              <div key={u._id} className="rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
                <p className="text-sm font-semibold text-navy-900">{u.firstName} {u.lastName}</p>
                <p className="text-xs text-navy-400">{u.email}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge tone={u.role === "admin" ? "warning" : "neutral"}>{u.role}</Badge>
                  {u.vendorId && <Badge tone={u.isApproved ? "success" : "warning"}>{u.isApproved ? "Approved" : "Pending"}</Badge>}
                  <Badge tone={u.isActive ? "success" : "danger"}>{u.isActive ? "Active" : "Inactive"}</Badge>
                </div>
                <div className="mt-3 flex gap-2">
                  {u.vendorId && !u.isApproved ? (
                    <>
                      <Button size="sm" className="flex-1" onClick={() => handleApprove(u)} loading={actionLoading === u._id}>Approve</Button>
                      <Button size="sm" variant="danger" className="flex-1" onClick={() => setRejectTarget(u)}>Reject</Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleToggleStatus(u)} loading={actionLoading === u._id}>
                      {u.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6"><Pagination page={meta.page || page} totalPages={meta.totalPages} onPageChange={setPage} /></div>
        </>
      )}

      <Modal open={Boolean(rejectTarget)} onClose={() => setRejectTarget(null)} title="Reject Vendor Registration">
        <p className="mb-3 text-sm text-navy-500">
          This will permanently remove {rejectTarget?.firstName}'s registration. Please provide a reason — it will be emailed to them.
        </p>
        <Textarea placeholder="Reason for rejection" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} />
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setRejectTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleReject} loading={actionLoading === rejectTarget?._id} disabled={!rejectReason.trim()}>
            Reject Registration
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;
