import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../../api/auth.api";
import { customerRegisterSchema } from "../../utils/validationSchemas";
import { ROUTES } from "../../constants/routes";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthCard from "./AuthCard";

const RegisterCustomer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(customerRegisterSchema) });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await authApi.register(values);
      toast.success("Account created! You can log in now.");
      navigate(ROUTES.LOGIN);
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

  return (
    <AuthCard title="Create your account" subtitle="Shop uniforms &amp; PPE across Egypt, instantly active">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" error={errors.firstName?.message} {...register("firstName")} />
          <Input label="Last name" error={errors.lastName?.message} {...register("lastName")} />
        </div>
        <Input label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register("email")} />
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
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-navy-500">
        Already have an account?{" "}
        <Link to={ROUTES.LOGIN} className="font-semibold text-navy-900 hover:underline">
          Log in
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-navy-500">
        Registering on behalf of a DSP company?{" "}
        <Link to={ROUTES.REGISTER_VENDOR} className="font-semibold text-navy-900 hover:underline">
          Register as a vendor user
        </Link>
      </p>
    </AuthCard>
  );
};

export default RegisterCustomer;
