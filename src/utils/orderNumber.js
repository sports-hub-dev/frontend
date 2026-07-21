/**
 * Order numbers are always displayed uppercase, e.g. SH240115-12345
 */
export const formatOrderNumber = (orderNumber) => (orderNumber ? orderNumber.toUpperCase() : "");
