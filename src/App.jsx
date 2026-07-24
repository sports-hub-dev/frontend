import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { restoreSession } from "./app/authSlice";
import { ROUTES } from "./constants/routes";
import ScrollToTop from "./components/layout/ScrollToTop";
import PublicLayout from "./layouts/PublicLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import AdminContact from "./pages/admin/AdminContact";

// Public pages
import Home from "./pages/public/Home";
import Products from "./pages/public/Products";
import ProductDetail from "./pages/public/ProductDetail";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Login from "./pages/public/Login";
import RegisterCustomer from "./pages/public/RegisterCustomer";
import RegisterVendor from "./pages/public/RegisterVendor";
import TrackOrder from "./pages/public/TrackOrder";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";
import NotFound from "./pages/public/NotFound";
import TermsAndConditions from "./pages/public/legal/TermsAndConditions";
import PrivacyPolicy from "./pages/public/legal/PrivacyPolicy";
import DeliveryPolicy from "./pages/public/legal/DeliveryPolicy";
import CancellationPolicy from "./pages/public/legal/CancellationPolicy";
import RefundPolicy from "./pages/public/legal/RefundPolicy";

// Customer pages
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import MyOrders from "./pages/customer/MyOrders";
import OrderDetail from "./pages/customer/OrderDetail";
import Profile from "./pages/customer/Profile";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminPromoCodes from "./pages/admin/AdminPromoCodes";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminSettings from "./pages/admin/AdminSettings";

function App() {
  const dispatch = useDispatch();

  // Silent session restore — attempts a token refresh on first load so a
  // returning user with a valid httpOnly refresh cookie stays logged in.
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.PRODUCTS} element={<Products />} />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetail />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />
          <Route path={ROUTES.TERMS} element={<TermsAndConditions />} />
          <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
          <Route path={ROUTES.DELIVERY_POLICY} element={<DeliveryPolicy />} />
          <Route path={ROUTES.CANCELLATION_POLICY} element={<CancellationPolicy />} />
          <Route path={ROUTES.REFUND_POLICY} element={<RefundPolicy />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<RegisterCustomer />} />
          <Route path={ROUTES.REGISTER_VENDOR} element={<RegisterVendor />} />
          <Route path={ROUTES.TRACK_ORDER} element={<TrackOrder />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Route>

        {/* Protected customer routes — own layout shell (Navbar + Footer + auth guard) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<CustomerLayout />}>
            <Route path={ROUTES.CART} element={<Cart />} />
            <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
            <Route path={ROUTES.MY_ORDERS} element={<MyOrders />} />
            <Route path={ROUTES.ORDER_DETAIL} element={<OrderDetail />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.ADMIN_PRODUCTS} element={<AdminProducts />} />
            <Route path={ROUTES.ADMIN_ORDERS} element={<AdminOrders />} />
            <Route path={ROUTES.ADMIN_USERS} element={<AdminUsers />} />
            <Route path={ROUTES.ADMIN_VENDORS} element={<AdminVendors />} />
            <Route path={ROUTES.ADMIN_PROMO_CODES} element={<AdminPromoCodes />} />
            <Route path={ROUTES.ADMIN_FEEDBACK} element={<AdminFeedback />} />
            <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminSettings />} />
            <Route path={ROUTES.ADMIN_CONTACT} element={<AdminContact />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
