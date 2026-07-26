import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { paymentsApi } from "../../api/payments.api";
import { ordersApi } from "../../api/orders.api";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { ROUTES, buildRoute } from "../../constants/routes";
import AddressFormFields, { addressSchema } from "../../components/order/AddressFormFields";
import CartSummary from "../../components/cart/CartSummary";
import StripeCardForm from "../../components/payment/StripeCardForm";
import Button from "../../components/ui/Button";
import { cn } from "../../utils/cn";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authApi } from "../../api/auth.api";
import { fetchCurrentUser } from "../../app/authSlice";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "");

const PAYMENT_METHODS = [
  { value: "aps", label: "Amazon Payment Services", desc: "Cards, wallets & local payment methods — redirected to a secure page" },
  { value: "stripe", label: "Credit / Debit Card", desc: "Pay directly on this page via Stripe" },
];

/**
 * Amazon Payment Services (APS) is a hosted-checkout gateway: the backend
 * builds a signed set of form fields, and the browser is redirected via an
 * auto-submitting POST form to APS's payment page. The customer completes
 * payment there, then APS redirects them back to a backend `return_url`
 * (which verifies the signature server-side) before finally landing back on
 * /orders/:id?payment=success.
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
  const dispatch = useDispatch();
  const [savingAddress, setSavingAddress] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, promo, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("aps");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Only used for the Stripe flow — APS redirects immediately and never sets this.
  const [paymentSession, setPaymentSession] = useState(null); // { orderId, orderNumber, clientSecret }
  const [confirming, setConfirming] = useState(false);
  const pollRef = useRef(null);

  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
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
    if (!items.length && !paymentSession) navigate(ROUTES.CART, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => pollRef.current && clearInterval(pollRef.current), []);

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

  const handleSaveAddress = async () => {
    const valid = await trigger(["fullName", "phoneNumber", "city", "area", "street", "building", "floor", "apartment", "notes"]);
    if (!valid) {
      toast.error("Please fill in the address fields correctly before saving");
      return;
    }
    setSavingAddress(true);
    try {
      await authApi.addAddress(getValues());
      await dispatch(fetchCurrentUser());
      toast.success("Address saved to your profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't save address");
    } finally {
      setSavingAddress(false);
    }
  };

  const startPolling = (orderId) => {
    setConfirming(true);
    pollRef.current = setInterval(async () => {
      try {
        const { data } = await paymentsApi.getPaymentStatus(orderId);
        if (data.data.paymentStatus === "paid") {
          clearInterval(pollRef.current);
          setConfirming(false);
          clearCart();
          toast.success("Payment confirmed!");
          navigate(`${buildRoute(ROUTES.ORDER_DETAIL, { id: orderId })}?payment=success`);
        } else if (data.data.paymentStatus === "failed") {
          clearInterval(pollRef.current);
          setConfirming(false);
          setPaymentError("Payment failed. You can try again below.");
        }
      } catch {
        // transient errors ignored — polling continues until success/failure or unmount
      }
    }, 2000);
  };

  const handlePlaceOrder = async (address) => {
    setPlacingOrder(true);
    setPaymentError("");
    try {
      if (paymentMethod === "stripe") {
        const { data } = await paymentsApi.createStripeOrder(buildOrderPayload(address));
        setPaymentSession({
          orderId: data.data.order._id,
          orderNumber: data.data.order.orderNumber,
          clientSecret: data.data.stripe.clientSecret,
        });
      } else {
        const { data } = await paymentsApi.createApsOrder(buildOrderPayload(address));
        // Cart is intentionally NOT cleared here — the order exists server-side now
        // (paymentStatus: "pending"), but if payment fails on APS's page, the customer
        // returns to /checkout?payment=failed and needs their cart intact to retry.
        // The cart is only cleared once payment is confirmed — see OrderDetail.jsx,
        // which clears it when it detects the ?payment=success confirmation.
        redirectToAps(data.data.aps);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't start checkout. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  /**
   * TESTING ONLY — places the order via POST /orders directly, skipping both payment
   * gateways entirely. The backend creates the order with paymentMethod "unpaid" /
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

  const stripeOptions = useMemo(
    () => (paymentSession?.clientSecret ? { clientSecret: paymentSession.clientSecret } : undefined),
    [paymentSession?.clientSecret]
  );

  if (!items.length && !paymentSession) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-2xl font-bold text-navy-900">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Shipping address */}
          <div className="animate-fadeUp rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-navy-900">Shipping Address</h2>
              <Button type="button" variant="outline" size="sm" onClick={handleSaveAddress} loading={savingAddress}>
                Save Address
              </Button>
            </div>
            <fieldset disabled={Boolean(paymentSession)} className={cn(paymentSession && "opacity-60")}>
              <AddressFormFields register={register} errors={errors} />
            </fieldset>
          </div>

          {/* Payment */}
          <div className="animate-fadeUp rounded-2xl border border-navy-100 bg-white p-6 shadow-card" style={{ animationDelay: "80ms" }}>
            <h2 className="mb-4 font-display text-base font-semibold text-navy-900">Payment</h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  disabled={Boolean(paymentSession)}
                  onClick={() => setPaymentMethod(m.value)}
                  className={cn(
                    "btn-transition rounded-xl border p-4 text-left disabled:cursor-not-allowed disabled:opacity-60",
                    paymentMethod === m.value ? "border-navy-900 bg-navy-50" : "border-navy-200 hover:border-navy-400"
                  )}
                >
                  <p className="text-sm font-semibold text-navy-900">{m.label}</p>
                  <p className="text-xs text-navy-400">{m.desc}</p>
                </button>
              ))}
            </div>

            {!paymentSession && (
              <Button onClick={handleSubmit(handlePlaceOrder)} loading={placingOrder} size="lg" className="mt-6 w-full">
                Place Order
              </Button>
            )}

            <p className="mt-3 text-center text-xs text-navy-400">
              By placing your order, you agree to our{" "}
              <Link to={ROUTES.TERMS} className="underline hover:text-navy-700">Terms</Link>,{" "}
              <Link to={ROUTES.REFUND_POLICY} className="underline hover:text-navy-700">Refund</Link>, and{" "}
              <Link to={ROUTES.DELIVERY_POLICY} className="underline hover:text-navy-700">Delivery</Link> policies.
            </p>

            {/* TESTING ONLY — never rendered in a production build (npm run build sets NODE_ENV=production) */}
            {!paymentSession && process.env.NODE_ENV !== "production" && (
              <div className="mt-4 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Testing Only</p>
                <p className="mt-1 text-xs text-amber-700/80">
                  Skips both payment gateways entirely and creates the order directly (paymentMethod: unpaid).
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

            {/* Stripe card form — only appears after the order is created */}
            {paymentSession?.clientSecret && (
              <div className="mt-6 animate-fadeUp border-t border-navy-100 pt-6">
                <p className="mb-3 tracking-code text-xs text-navy-400">ORDER {paymentSession.orderNumber}</p>
                <Elements stripe={stripePromise} options={stripeOptions}>
                  <StripeCardForm
                    clientSecret={paymentSession.clientSecret}
                    onSuccess={() => startPolling(paymentSession.orderId)}
                    onError={(msg) => setPaymentError(msg)}
                    submitLabel={confirming ? "Confirming payment…" : "Pay now"}
                  />
                </Elements>
                {confirming && (
                  <p className="mt-3 text-center text-xs text-navy-400">
                    Confirming your payment — this can take a few seconds…
                  </p>
                )}
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