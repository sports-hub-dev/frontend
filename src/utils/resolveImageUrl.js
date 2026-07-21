/**
 * Order line items sometimes come back from the API with a bare filename
 * (e.g. "abc123.jpg") instead of a full URL — the backend snapshots the
 * product's mainImage onto the order without running it through the same
 * URL-resolving step used for regular product responses.
 *
 * This mirrors that same resolution rule (baseUrl + /uploads/products/<file>)
 * so images still render correctly until the backend is fixed to store the
 * resolved URL on the order itself.
 */
const API_ORIGIN = (process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1").replace(/\/api\/v\d+\/?$/, "");

export const resolveImageUrl = (image) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_ORIGIN}/uploads/products/${image}`;
};
