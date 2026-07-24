import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../../api/auth.api";
import { vendorsApi } from "../../api/vendors.api";
import { vendorRegisterSchema } from "../../utils/validationSchemas";
import { ROUTES } from "../../constants/routes";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import AuthCard from "./AuthCard";

/**
 * Any active, approved vendor/DSP company the backend returns from
 * GET /vendors/active shows up here automatically — Amazon Egypt, or any
 * future DSP the admin onboards — with no frontend changes required.
 */
const RegisterVendor = () => {
  const [vendors, setVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(vendorRegisterSchema) });

  useEffect(() => {
    vendorsApi
      .getActiveVendors()
      .then(({ data }) => setVendors(data.data.vendors))
      .catch(() => toast.error("Couldn't load the list of DSP vendors. Please refresh."))
      .finally(() => setVendorsLoading(false));
  }, []);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await authApi.registerVendorUser(values);
      setSubmitted(true);
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors?.length) {
        apiErrors.forEach((e) => setError(e.field, { message: e.message }));
      } else {
        toast.error(err.response?.data?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthCard title="Registration submitted" subtitle="One more step before you can start ordering">
        <div className="animate-scaleIn text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-safety-greenLight text-safety-green">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm leading-relaxed text-navy-600">
            Your registration has been submitted. You will receive an email once your account is approved by Sports Hub.
          </p>
          <Link to={ROUTES.LOGIN}>
            <Button variant="outline" className="mt-6">Back to log in</Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Register as a DSP vendor user"
      subtitle="For employees of Amazon delivery service partners and other approved vendor companies"
      wide
    >
      <div className="mb-5 rounded-lg border border-navy-100 bg-navy-50 px-4 py-3 text-xs text-navy-500">
        Your account will be locked until a Sports Hub admin manually approves it. Once approved, you'll see public
        products plus your vendor's private catalogue.
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" error={errors.firstName?.message} {...register("firstName")} />
          <Input label="Last name" error={errors.lastName?.message} {...register("lastName")} />
        </div>
        <Input label="Email" type="email" placeholder="you@dspcompany.com" error={errors.email?.message} {...register("email")} />
        <Input
          label="Phone number"
          error={errors.phoneNumber?.message}
          {...register("phoneNumber")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          hint="At least 8 characters, with uppercase, lowercase, and a number"
          error={errors.password?.message}
          {...register("password")}
        />

        {vendorsLoading ? (
          <Skeleton className="h-11 w-full" />
        ) : (
          <Controller
            name="vendorId"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                label="DSP / Vendor Company"
                placeholder={vendors.length ? "Select your vendor company" : "No active vendors available"}
                options={vendors.map((v) => ({ value: v._id, label: v.name }))}
                error={errors.vendorId?.message}
                disabled={!vendors.length}
                {...field}
              />
            )}
          />
        )}

        <Button type="submit" loading={loading} className="w-full" size="lg" disabled={!vendors.length && !vendorsLoading}>
          Submit for approval
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-navy-500">
        Not a vendor employee?{" "}
        <Link to={ROUTES.REGISTER} className="font-semibold text-navy-900 hover:underline">
          Register as a regular customer
        </Link>
      </p>
    </AuthCard>
  );
};

export default RegisterVendor;
