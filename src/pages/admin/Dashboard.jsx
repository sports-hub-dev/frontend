import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import toast from "react-hot-toast";
import { analyticsApi } from "../../api/analytics.api";
import { adminApi } from "../../api/admin.api";
import { formatPrice } from "../../utils/formatPrice";
import { ORDER_STATUS_LABELS } from "../../constants/orderStatus";
import Skeleton from "../../components/ui/Skeleton";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const PIE_COLORS = ["#10192C", "#F2A93B", "#2E8B4F", "#5C71A3", "#C4432E", "#8595BC"];

const StatCard = ({ label, value, sub, tone = "navy" }) => (
  <div className="animate-fadeUp rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
    <p className="text-xs font-medium uppercase tracking-wide text-navy-400">{label}</p>
    <p className={`mt-2 font-display text-2xl font-bold ${tone === "amber" ? "text-amber-600" : "text-navy-900"}`}>{value}</p>
    {sub && <p className="mt-1 text-xs text-navy-400">{sub}</p>}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [statusBreakdown, setStatusBreakdown] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [exporting, setExporting] = useState(false);
  const [exportRange, setExportRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10) };
  });

  const handleExportExcel = async () => {
    if (!exportRange.startDate || !exportRange.endDate) {
      toast.error("Please select both a start and end date");
      return;
    }
    if (new Date(exportRange.startDate) > new Date(exportRange.endDate)) {
      toast.error("Start date must be before end date");
      return;
    }
    setExporting(true);
    try {
      const { buildAnalyticsWorkbook, downloadWorkbook } = await import("../../utils/analyticsExport");
      const workbook = await buildAnalyticsWorkbook(
        {
          startDate: new Date(exportRange.startDate).toISOString(),
          endDate: new Date(exportRange.endDate).toISOString(),
        },
        statusBreakdown
      );
      await downloadWorkbook(workbook, `sportshub-analytics-${exportRange.startDate}-to-${exportRange.endDate}.xlsx`);
      toast.success("Analytics exported");
    } catch (err) {
      toast.error("Couldn't export analytics. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    const wideRangeStart = new Date();
    wideRangeStart.setFullYear(wideRangeStart.getFullYear() - 1);

    Promise.all([
      analyticsApi.getLowStockProducts({ threshold: 5 }),
      adminApi.getPendingVendorUsers({ limit: 1 }),
      analyticsApi.getRevenueByPeriod({ period: "daily", limit: 30 }),
      analyticsApi.getOrderStatusBreakdown(),
      analyticsApi.getDateRangeAnalytics({ startDate: wideRangeStart.toISOString(), endDate: new Date().toISOString() }),
    ])
      .then(([lowStockRes, pendingRes, revenueRes, statusRes, rangeRes]) => {
        setStats({
          totalRevenue: rangeRes.data.data.summary.totalRevenue || 0,
          totalOrders: rangeRes.data.data.summary.totalOrders || 0,
          lowStockCount: (lowStockRes.data.data.products || []).length,
          pendingVendorCount: pendingRes.data.meta?.total ?? pendingRes.data.data.length,
        });
        setRevenue(
          (revenueRes.data.data.revenue || []).map((d) => ({
            label: `${d._id.day}/${d._id.month}`,
            revenue: d.revenue,
          }))
        );
        setStatusBreakdown(
          (statusRes.data.data.breakdown || []).map((s) => ({ name: ORDER_STATUS_LABELS[s._id] || s._id, value: s.count }))
        );
        setTopProducts(rangeRes.data.data.topProducts || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-navy-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatPrice(stats.totalRevenue)} sub="Last 12 months" />
        <StatCard label="Total Orders" value={stats.totalOrders.toLocaleString()} sub="Last 12 months" />
        <StatCard label="Low Stock Products" value={stats.lowStockCount} sub="≤ 5 units remaining" tone="amber" />
        <StatCard label="Pending Vendor Users" value={stats.pendingVendorCount} sub="Awaiting approval" tone="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="animate-fadeUp rounded-2xl border border-navy-100 bg-white p-6 shadow-card lg:col-span-2">
          <h3 className="mb-4 font-display text-sm font-semibold text-navy-900">Revenue — Last 30 Days</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F7" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8595BC" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8595BC" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => formatPrice(v)} contentStyle={{ borderRadius: 10, fontSize: 12, border: "1px solid #EEF1F7" }} />
              <Line type="monotone" dataKey="revenue" stroke="#F2A93B" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="animate-fadeUp rounded-2xl border border-navy-100 bg-white p-6 shadow-card" style={{ animationDelay: "80ms" }}>
          <h3 className="mb-4 font-display text-sm font-semibold text-navy-900">Order Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {statusBreakdown.map((entry, i) => (
                  <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: "1px solid #EEF1F7" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {statusBreakdown.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-navy-500">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                {s.name} ({s.value})
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products (60%) + Excel Export (40%) side by side on large screens */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="animate-fadeUp rounded-2xl border border-navy-100 bg-white p-6 shadow-card lg:col-span-3">
          <h3 className="mb-4 font-display text-sm font-semibold text-navy-900">Top 5 Products</h3>
          {topProducts.length ? (
            <div className="divide-y divide-navy-100">
              {topProducts.slice(0, 5).map((p, i) => (
                <div key={p._id || i} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-navy-700">{i + 1}. {p.name}</span>
                  <span className="font-mono font-medium text-navy-900">{formatPrice(p.revenue || 0)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-navy-400">No product sales data for this range yet.</p>
          )}
        </div>

        <div className="animate-fadeUp flex flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-card lg:col-span-2" style={{ animationDelay: "80ms" }}>
          <h3 className="mb-4 font-display text-sm font-semibold text-navy-900">Export Analytics</h3>
          <div className="items-end gap-2">
            <Input
              label="From"
              type="date"
              value={exportRange.startDate}
              onChange={(e) => setExportRange((r) => ({ ...r, startDate: e.target.value }))}
              containerClassName="w-36"
            />
            <Input
              label="To"
              type="date"
              value={exportRange.endDate}
              onChange={(e) => setExportRange((r) => ({ ...r, endDate: e.target.value }))}
              containerClassName="w-36"
            />
          </div>
          <Button variant="outline" onClick={handleExportExcel} loading={exporting} className="mt-auto w-full">
            Export to Excel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;