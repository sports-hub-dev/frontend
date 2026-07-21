import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { paymentsApi } from "../../api/payments.api";
import { ordersApi } from "../../api/orders.api";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { ROUTES, buildRoute } from "../../constants/routes";
import AddressFormFields, { addressSchema } from "../../components/order/AddressFormFields";
import CartSummary from "../../components/cart/CartSummary";
import Button from "../../components/ui/Button";
import { cn } from "../../utils/cn";
import { useNavigate, Link } from "react-router-dom";

/**
 * Amazon Payment Services (APS) is a hosted-checkout gateway: the backend
 * builds a signed set of form fields, and the browser is redirected via an
 * auto-submitting POST form to APS's payment page. The customer completes
 * payment there, then APS redirects them back to a backend `return_url`
 * (which verifies the signature server-side) before finally landing back on
 * /orders/:id?payment=success — so there's no client-side card form or
 * iframe to render here, just a redirect.
 */
const redirectToAps = ({ checkoutUrl, formFields }) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = checkoutUrl;

  Object.entries(formFields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, promo, clearCart } = useCart();

  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: defaultAddress
      ? {
        fullName: defaultAddress.fullName,
        phoneNumber: defaultAddress.phoneNumber,
        city: defaultAddress.city,
        area: defaultAddress.area,
        street: defaultAddress.street,
        building: defaultAddress.building,
        floor: defaultAddress.floor,
        apartment: defaultAddress.apartment,
        notes: defaultAddress.notes,
      }
      : {},
  });

  useEffect(() => {
    if (!items.length) navigate(ROUTES.CART, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildOrderPayload = (address) => ({
    customerInfo: {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phoneNumber || address.phoneNumber,
    },
    shippingAddress: address,
    items: items.map((i) => ({ product: i.productId, quantity: i.quantity, ...(i.size ? { size: i.size } : {}) })),
    ...(promo ? { promoCode: promo.code } : {}),
  });

  const handlePlaceOrder = async (address) => {
    setPlacingOrder(true);
    setPaymentError("");
    try {
      const { data } = await paymentsApi.createApsOrder(buildOrderPayload(address));
      // Cart is intentionally NOT cleared here — the order exists server-side now
      // (paymentStatus: "pending"), but if payment fails on APS's page, the customer
      // returns to /checkout?payment=failed and needs their cart intact to retry.
      // The cart is only cleared once payment is confirmed — see OrderDetail.jsx,
      // which clears it when it detects the ?payment=success confirmation.
      redirectToAps(data.data.aps);
    } catch (err) {
      setPlacingOrder(false);
      toast.error(err.response?.data?.message || "Couldn't start checkout. Please try again.");
    }
  };

  /**
   * TESTING ONLY — places the order via POST /orders directly, skipping Amazon Payment
   * Services entirely. The backend creates the order with paymentMethod "unpaid" /
   * paymentStatus "pending". Only rendered outside production builds (see JSX below)
   * so it can never ship to real customers.
   */
  const handleTestOrder = async (address) => {
    setPlacingOrder(true);
    try {
      const { data } = await ordersApi.createOrder(buildOrderPayload(address));
      clearCart();
      toast.success("Test order placed (payment skipped)");
      navigate(buildRoute(ROUTES.ORDER_DETAIL, { id: data.data.order._id }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't place test order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!items.length) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-2xl font-bold text-navy-900">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Shipping address */}
          <div className="animate-fadeUp rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
            <h2 className="mb-4 font-display text-base font-semibold text-navy-900">Shipping Address</h2>
            <AddressFormFields register={register} errors={errors} />
          </div>

          {/* Payment */}
          <div className="animate-fadeUp rounded-2xl border border-navy-100 bg-white p-6 shadow-card" style={{ animationDelay: "80ms" }}>
            <h2 className="mb-4 font-display text-base font-semibold text-navy-900">Payment</h2>
            <div className={cn("rounded-xl border border-navy-200 p-4")}>
              <p className="text-sm font-semibold text-navy-900">Amazon Payment Services</p>
              <p className="text-xs text-navy-400">Cards, wallets &amp; local payment methods — you'll be redirected to a secure payment page</p>
            </div>

            <Button onClick={handleSubmit(handlePlaceOrder)} loading={placingOrder} size="lg" className="mt-6 w-full">
              Place Order
            </Button>

            <p className="mt-3 text-center text-xs text-navy-400">
              By placing your order, you agree to our{" "}
              <Link to={ROUTES.TERMS} className="underline hover:text-navy-700">Terms</Link>,{" "}
              <Link to={ROUTES.REFUND_POLICY} className="underline hover:text-navy-700">Refund</Link>, and{" "}
              <Link to={ROUTES.DELIVERY_POLICY} className="underline hover:text-navy-700">Delivery</Link> policies.
            </p>

            {/* TESTING ONLY — never rendered in a production build (npm run build sets NODE_ENV=production) */}
            {process.env.NODE_ENV !== "production" && (
              <div className="mt-4 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Testing Only</p>
                <p className="mt-1 text-xs text-amber-700/80">
                  Skips Amazon Payment Services entirely and creates the order directly (paymentMethod: unpaid).
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSubmit(handleTestOrder)}
                  loading={placingOrder}
                  className="mt-3 w-full !border-amber-400 !text-amber-800 hover:!bg-amber-100"
                >
                  Place Order — Skip Payment
                </Button>
              </div>
            )}

            {paymentError && (
              <div className="mt-4 animate-slideDown rounded-lg border border-safety-red/20 bg-safety-redLight px-4 py-3 text-sm text-safety-red">
                {paymentError}
              </div>
            )}
          </div>
        </div>

        <div className="animate-fadeUp" style={{ animationDelay: "120ms" }}>
          <CartSummary readonly />
        </div>
      </div>
    </div>
  );
};

export default Checkout;