import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { settingsApi } from "../../api/settings.api";
import { REGIONS } from "../../constants/regions";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";

// Settings key per currency. EGP keeps the original "shippingFee" key.
const feeKey = (currency) => (currency === "EGP" ? "shippingFee" : `shippingFee_${currency}`);

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    settingsApi
      .getShippingFee()
      .then(({ data }) => {
        const fees = data.data.fees || { EGP: data.data.shippingFee };
        reset(Object.fromEntries(REGIONS.map((r) => [r.currency, fees[r.currency] ?? ""])));
      })
      .catch(() => toast.error("Couldn't load current settings"))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (values) => {
    try {
      for (const r of REGIONS) {
        const raw = values[r.currency];
        if (raw === "" || raw === null || raw === undefined) continue; // left empty = delivery closed there
        await settingsApi.updateSetting({ key: feeKey(r.currency), value: Number(raw) });
      }
      toast.success("Shipping fees updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't update setting");
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 font-display text-2xl font-bold text-navy-900">Settings</h1>

      <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
        <h2 className="mb-1 font-display text-base font-semibold text-navy-900">Shipping Fee per Region</h2>
        <p className="mb-4 text-sm text-navy-400">
          Flat fee added to every order in that region's currency. Checkout stays closed for a region until its fee is set.
        </p>

        {loading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {REGIONS.map((r) => (
              <Input
                key={r.code}
                label={`${r.name} (${r.currency})`}
                type="number"
                min="0"
                step="0.01"
                placeholder="Not set: checkout closed"
                {...register(r.currency)}
              />
            ))}
            <Button type="submit" loading={isSubmitting}>Save</Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
