import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { authApi } from "../../api/auth.api";
import { ROUTES } from "../../constants/routes";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import AuthCard from "./AuthCard";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    authApi.verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "This verification link is invalid or has expired.");
      });
  }, [token]);

  return (
    <AuthCard title="Email Verification">
      {status === "loading" && <div className="flex justify-center py-6"><Spinner size="lg" /></div>}
      {status === "success" && (
        <div className="text-center">
          <p className="text-sm text-safety-green">Your email has been verified! You can now log in.</p>
          <Link to={ROUTES.LOGIN}><Button className="mt-6">Go to Login</Button></Link>
        </div>
      )}
      {status === "error" && (
        <div className="text-center">
          <p className="text-sm text-safety-red">{message}</p>
          <Link to={ROUTES.LOGIN}><Button variant="outline" className="mt-6">Back to Login</Button></Link>
        </div>
      )}
    </AuthCard>
  );
};

export default VerifyEmail;