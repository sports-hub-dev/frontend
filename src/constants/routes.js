export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/:id",
  ABOUT: "/about",
  CONTACT: "/contact",
  TERMS: "/terms",
  PRIVACY_POLICY: "/privacy-policy",
  DELIVERY_POLICY: "/delivery-policy",
  CANCELLATION_POLICY: "/cancellation-policy",
  REFUND_POLICY: "/refund-policy",
  LOGIN: "/login",
  REGISTER: "/register",
  REGISTER_VENDOR: "/register/vendor",
  TRACK_ORDER: "/track",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",

  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_DETAIL: "/orders/:id",
  MY_ORDERS: "/orders",
  PROFILE: "/profile",

  ADMIN_DASHBOARD: "/admin",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_ORDER_DETAIL: "/admin/orders/:id",
  ADMIN_USERS: "/admin/users",
  ADMIN_VENDORS: "/admin/vendors",
  ADMIN_PROMO_CODES: "/admin/promo-codes",
  ADMIN_FEEDBACK: "/admin/feedback",
  ADMIN_SETTINGS: "/admin/settings",
  ADMIN_CONTACT: "/admin/contact",

  NOT_FOUND: "*",
};

export const buildRoute = (route, params = {}) => {
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  return path;
};
