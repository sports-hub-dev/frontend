import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginUser } from "../../app/authSlice";
import { ROUTES } from "../../constants/routes";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthCard from "./AuthCard";

const schema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pendingMessage, setPendingMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (values) => {
    setLoading(true);
    setPendingMessage("");
    const result = await dispatch(loginUser(values));

    if (loginUser.fulfilled.match(result)) {
      toast.success("Welcome back!");
      const redirect = searchParams.get("redirect");
      navigate(redirect || ROUTES.HOME);
    } else {
      const message = result.payload || "Login failed";
      // Vendor users awaiting admin approval get a 403 with this specific message —
      // surface it clearly instead of a generic "invalid credentials" toast.
      if (message.toLowerCase().includes("pending") || message.toLowerCase().includes("approval")) {
        setPendingMessage(message);
      } else {
        toast.error(message);
      }
    }
    setLoading(false);
  };

  return (
    <AuthCard title="Welcome back" subtitle="Log in to manage your orders and account">
      {pendingMessage && (
        <div className="mb-5 animate-slideDown rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong className="block font-semibold">Account pending approval</strong>
          {pendingMessage}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register("email")} />
        <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
        <div className="flex justify-end">
          <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs font-medium text-navy-500 hover:text-navy-900">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Log in
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-navy-500">
        New to Sports Hub?{" "}
        <Link to={ROUTES.REGISTER} className="font-semibold text-navy-900 hover:underline">
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-navy-500">
        Represent a DSP?{" "}
        <Link to={ROUTES.REGISTER_VENDOR} className="font-semibold text-navy-900 hover:underline">
          Register as a DSP vendor user
        </Link>
      </p>
    </AuthCard>
  );
};

export default Login;
