import ExcelJS from "exceljs";
import { analyticsApi } from "../api/analytics.api";

// Brand colors, matching tailwind.config.js
const NAVY = "FF10192C";
const AMBER = "FFF2A93B";
const WHITE = "FFFFFFFF";
const PAPER = "FFF6F5F1";
const BORDER_GRAY = "FFD6DCEA";

const THIN_BORDER = {
  top: { style: "thin", color: { argb: BORDER_GRAY } },
  left: { style: "thin", color: { argb: BORDER_GRAY } },
  bottom: { style: "thin", color: { argb: BORDER_GRAY } },
  right: { style: "thin", color: { argb: BORDER_GRAY } },
};

const styleHeaderRow = (row, { fill = NAVY, font = WHITE } = {}) => {
  row.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fill } };
    cell.font = { bold: true, color: { argb: font }, size: 11 };
    cell.alignment = { vertical: "middle", horizontal: "left" };
    cell.border = { bottom: { style: "thin", color: { argb: "FFFFFFFF" } } };
  });
  row.height = 22;
};

// NOTE: alignment/number formatting for data cells is applied per-cell, right when each
// row is added — never via `sheet.getColumn(n).alignment = {...}`. That call retroactively
// overwrites the *entire* existing style (including fill/border/wrapText) of every cell
// already in that column, which is what was wiping out the title row's styling.
const styleDataCell = (cell, { numFmt, align = "right", bold = false } = {}) => {
  if (numFmt) cell.numFmt = numFmt;
  cell.alignment = { horizontal: align, vertical: "middle" };
  if (bold) cell.font = { ...(cell.font || {}), bold: true };
};

const styleTitleRow = (sheet, title, colSpan) => {
  sheet.views = [{ rightToLeft: false }];
  sheet.mergeCells(1, 1, 1, colSpan);
  const cell = sheet.getCell(1, 1);
  cell.value = title;
  cell.font = { bold: true, size: 13, color: { argb: NAVY } };
  cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: PAPER } };
  cell.border = THIN_BORDER;
  sheet.getRow(1).height = 30;
};

const monthsAgoISO = (n) => {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString();
};

const nowISO = () => new Date().toISOString();

/**
 * Fetches everything needed and builds a 4-sheet, brand-styled workbook:
 *   1. Summary          — totals for the user-selected custom date range
 *   2. Revenue Trend     — rolling 3/6/9/12-month windows, for quick trend comparison
 *   3. Top Products      — best sellers within the custom date range
 *   4. Order Status      — account-wide status breakdown (no date filter available on this endpoint)
 */
export const buildAnalyticsWorkbook = async ({ startDate, endDate }, statusBreakdown) => {
  const [customRes, r3, r6, r9, r12] = await Promise.all([
    analyticsApi.getDateRangeAnalytics({ startDate, endDate }),
    analyticsApi.getDateRangeAnalytics({ startDate: monthsAgoISO(3), endDate: nowISO() }),
    analyticsApi.getDateRangeAnalytics({ startDate: monthsAgoISO(6), endDate: nowISO() }),
    analyticsApi.getDateRangeAnalytics({ startDate: monthsAgoISO(9), endDate: nowISO() }),
    analyticsApi.getDateRangeAnalytics({ startDate: monthsAgoISO(12), endDate: nowISO() }),
  ]);

  const summary = customRes.data.data.summary;
  const topProducts = customRes.data.data.topProducts || [];

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Sports Hub Admin";
  workbook.created = new Date();

  // ── Sheet 1: Summary ──────────────────────────────────────────────────
  const summarySheet = workbook.addWorksheet("Summary");
  summarySheet.columns = [{ key: "metric", width: 30 }, { key: "value", width: 22 }];
  styleTitleRow(summarySheet, `Sports Hub — Analytics Summary`, 2);
  summarySheet.addRow([]);
  const summaryHeader = summarySheet.addRow(["Metric", "Value"]);
  styleHeaderRow(summaryHeader);

  const summaryRows = [
    ["Total Orders", summary.totalOrders || 0],
    ["Total Revenue (EGP)", summary.totalRevenue || 0],
    ["Total Products Sold", summary.totalProductsSold || 0],
    ["Average Order Value (EGP)", Math.round(summary.avgOrderValue || 0)],
  ];
  summaryRows.forEach(([metric, value]) => {
    const row = summarySheet.addRow([metric, value]);
    styleDataCell(row.getCell(2), { numFmt: "#,##0" });
  });

  // ── Sheet 2: Revenue Trend ────────────────────────────────────────────
  const trendSheet = workbook.addWorksheet("Revenue Trend");
  trendSheet.columns = [
    { key: "period", width: 20 },
    { key: "revenue", width: 22 },
    { key: "orders", width: 16 },
  ];
  styleTitleRow(trendSheet, "Revenue Trend — Rolling Windows", 3);
  trendSheet.addRow([]);
  const trendHeader = trendSheet.addRow(["Period", "Total Revenue (EGP)", "Total Orders"]);
  styleHeaderRow(trendHeader);

  [
    ["Last 3 Months", r3],
    ["Last 6 Months", r6],
    ["Last 9 Months", r9],
    ["Last 12 Months", r12],
  ].forEach(([label, res], i) => {
    const s = res.data.data.summary;
    const isLast = i === 3;
    const row = trendSheet.addRow([label, s.totalRevenue || 0, s.totalOrders || 0]);
    styleDataCell(row.getCell(2), { numFmt: "#,##0", bold: isLast });
    styleDataCell(row.getCell(3), { bold: isLast });
    if (isLast) row.getCell(1).font = { bold: true }; // highlight the widest window
  });

  // ── Sheet 3: Top Products ─────────────────────────────────────────────
  const productsSheet = workbook.addWorksheet("Top Products");
  productsSheet.columns = [
    { key: "rank", width: 8 },
    { key: "name", width: 40 },
    { key: "quantity", width: 16 },
    { key: "revenue", width: 18 },
  ];
  styleTitleRow(productsSheet, `Top Products`, 4);
  productsSheet.addRow([]);
  const productsHeader = productsSheet.addRow(["Rank", "Product", "Quantity Sold", "Revenue (EGP)"]);
  styleHeaderRow(productsHeader);

  if (topProducts.length) {
    topProducts.forEach((p, i) => {
      const row = productsSheet.addRow([i + 1, p.name, p.totalQuantity || 0, p.revenue || 0]);
      styleDataCell(row.getCell(3));
      styleDataCell(row.getCell(4), { numFmt: "#,##0" });
    });
  } else {
    productsSheet.addRow(["—", "No product sales in this date range", "—", "—"]);
  }

  // ── Sheet 4: Order Status Breakdown (account-wide — this endpoint has no date filter) ──
  const statusSheet = workbook.addWorksheet("Order Status");
  statusSheet.columns = [{ key: "status", width: 22 }, { key: "count", width: 14 }];
  styleTitleRow(statusSheet, "Order Status Breakdown", 2);
  statusSheet.addRow([]);
  const statusHeader = statusSheet.addRow(["Status", "Count"]);
  styleHeaderRow(statusHeader, { fill: AMBER, font: NAVY });

  statusBreakdown.forEach((s) => {
    const row = statusSheet.addRow([s.name, s.value]);
    styleDataCell(row.getCell(2));
  });

  return workbook;
};

/** Triggers a browser download for the given ExcelJS workbook. */
export const downloadWorkbook = async (workbook, filename) => {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
