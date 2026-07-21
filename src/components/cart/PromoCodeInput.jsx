import React, { useState } from "react";
import { promosApi } from "../../api/promos.api";
import { useCart } from "../../hooks/useCart";
import Button from "../ui/Button";
import Input from "../ui/Input";

const PromoCodeInput = () => {
  const { promo, setPromo, clearPromo } = useCart();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await promosApi.validatePromoCode(code.trim());
      setPromo({ code: data.data.code, discountPercentage: data.data.discountPercentage });
      setCode("");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired promo code");
    } finally {
      setLoading(false);
    }
  };

  if (promo) {
    return (
      <div className="flex animate-fadeUp items-center justify-between rounded-lg bg-safety-greenLight px-4 py-3">
        <div>
          <p className="tracking-code text-sm font-semibold text-safety-green">{promo.code}</p>
          <p className="text-xs text-safety-green/80">{promo.discountPercentage}% discount applied</p>
        </div>
        <button onClick={clearPromo} className="text-xs font-medium text-safety-green underline-offset-2 hover:underline">
          Remove
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="flex items-start gap-2">
      <Input
        placeholder="Promo code"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        error={error}
        containerClassName="flex-1"
      />
      <Button type="submit" variant="outline" loading={loading} className="mt-0 shrink-0">
        Apply
      </Button>
    </form>
  );
};

export default PromoCodeInput;
