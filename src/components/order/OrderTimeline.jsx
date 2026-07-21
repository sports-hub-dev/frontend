import React from "react";
import { formatDateTime } from "../../utils/formatDate";
import { OrderStatusBadge } from "./StatusBadge";

/** Renders order.timeline as a vertical manifest-style timeline. */
const OrderTimeline = ({ timeline = [] }) => {
  if (!timeline.length) {
    return <p className="text-sm text-navy-400">No status updates yet.</p>;
  }

  return (
    <ol className="relative space-y-6 pl-6">
      <div className="absolute left-[7px] top-1 bottom-1 w-px bg-navy-100" aria-hidden="true" />
      {[...timeline].reverse().map((entry, idx) => (
        <li key={entry._id || idx} className="relative animate-fadeUp" style={{ animationDelay: `${idx * 60}ms` }}>
          <span className={`absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-white ${idx === 0 ? "bg-amber" : "bg-navy-300"}`} />
          <div className="flex flex-wrap items-center gap-2">
            <OrderStatusBadge status={entry.newStatus} />
            <span className="text-xs text-navy-400">{formatDateTime(entry.timestamp)}</span>
          </div>
          {entry.notes && <p className="mt-1.5 text-sm text-navy-600">{entry.notes}</p>}
          {entry.changedByName && <p className="mt-0.5 text-xs text-navy-400">by {entry.changedByName}</p>}
        </li>
      ))}
    </ol>
  );
};

export default OrderTimeline;
