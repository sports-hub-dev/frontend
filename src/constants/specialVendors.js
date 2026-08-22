export const SPECIAL_VENDORS = [
  { id: "6a87012f02ae789849814c85", name: "Amazon KSA" },
  { id: "6a5afbcd7165c36bc49f4f36", name: "Amazon UAE" },
];

export const SPECIAL_VENDOR_IDS = SPECIAL_VENDORS.map((v) => v.id);

export const getEntityId = (value) => (typeof value === "string" ? value : value?._id) || null;