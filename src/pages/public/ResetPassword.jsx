import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../../api/auth.api";
import { passwordRule } from "../../utils/validationSchemas";
import { ROUTES } from "../../constants/routes";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthCard from "./AuthCard";

const schema = yup.object({
  password: passwordRule,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await authApi.resetPassword(token, values);
      toast.success("Password reset successfully — please log in.");
      navigate(ROUTES.LOGIN);
    } catch (err) {
      toast.error(err.response?.data?.message || "This reset link is invalid or has expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Set a new password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="New password"
          type="password"
          placeholder="••••••••"
          hint="At least 8 characters, with uppercase, lowercase, and a number"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm new password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Reset password
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

export default ResetPassword;
