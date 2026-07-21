export const formatDate = (date, options = {}) => {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  });
};

export const formatDateTime = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return `${formatDate(d)} · ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
};

export const timeAgo = (date) => {
  if (!date) return "—";
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, secs] of units) {
    const amount = Math.floor(seconds / secs);
    if (amount >= 1) return `${amount} ${unit}${amount > 1 ? "s" : ""} ago`;
  }
  return "just now";
};
