import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { settingsApi } from "../../api/settings.api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    settingsApi
      .getShippingFee()
      .then(({ data }) => reset({ shippingFee: data.data.shippingFee }))
      .catch(() => toast.error("Couldn't load current settings"))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (values) => {
    try {
      await settingsApi.updateSetting({ key: "shippingFee", value: Number(values.shippingFee) });
      toast.success("Shipping fee updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't update setting");
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 font-display text-2xl font-bold text-navy-900">Settings</h1>

      <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
        <h2 className="mb-1 font-display text-base font-semibold text-navy-900">Shipping Fee</h2>
        <p className="mb-4 text-sm text-navy-400">Applied to every order at checkout, in EGP.</p>

        {loading ? (
          <Skeleton className="h-11 w-full" />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex items-start gap-3">
            <Input type="number" min="0" step="0.01" containerClassName="flex-1" {...register("shippingFee", { required: true })} />
            <Button type="submit" loading={isSubmitting} className="mt-0">Save</Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
