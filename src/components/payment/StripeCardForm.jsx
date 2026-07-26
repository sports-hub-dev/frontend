import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "../ui/Button";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "15px",
      fontFamily: "Inter, sans-serif",
      color: "#141A24",
      "::placeholder": { color: "#8595BC" },
    },
    invalid: { color: "#C4432E" },
  },
};

const StripeCardForm = ({ clientSecret, onSuccess, onError, submitLabel = "Pay now" }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setCardError("");

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (error) {
      setCardError(error.message);
      onError?.(error.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") {
      onSuccess?.();
    } else {
      setCardError("Payment could not be confirmed. Please try again.");
      onError?.("Payment could not be confirmed.");
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-navy-200 bg-white px-3.5 py-3.5 transition-colors focus-within:border-navy-400 focus-within:ring-2 focus-within:ring-amber-400/60">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      {cardError && <p className="animate-slideDown text-sm font-medium text-safety-red">{cardError}</p>}
      <Button type="submit" disabled={!stripe} loading={processing} className="w-full" size="lg">
        {submitLabel}
      </Button>
    </form>
  );
};

export default StripeCardForm;