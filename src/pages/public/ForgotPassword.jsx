import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { authApi } from "../../api/auth.api";
import { ROUTES } from "../../constants/routes";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthCard from "./AuthCard";

const schema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
});

const ForgotPassword = () => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
    } finally {
      // Always show the same confirmation, regardless of whether the email exists,
      // to avoid leaking which addresses are registered.
      setSent(true);
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthCard title="Check your email">
        <div className="animate-scaleIn text-center">
          <p className="text-sm leading-relaxed text-navy-600">
            If an account exists for that email, we've sent a link to reset your password.
          </p>
          <Link to={ROUTES.LOGIN}>
            <Button variant="outline" className="mt-6">Back to log in</Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Forgot your password?" subtitle="We'll email you a link to reset it">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register("email")} />
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Send reset link
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-navy-500">
        <Link to={ROUTES.LOGIN} className="font-semibold text-navy-900 hover:underline">
          Back to log in
        </Link>
      </p>
    </AuthCard>
  );
};

export default ForgotPassword;
