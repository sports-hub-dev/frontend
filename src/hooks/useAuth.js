import { useSelector, useDispatch } from "react-redux";
import { loginUser, logoutUser } from "../app/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, status, sessionChecked } = useSelector((state) => state.auth);

  const isVendorUser = Boolean(user?.vendorId);
  const isPendingApproval = isVendorUser && !user?.isApproved;
  const isAdmin = user?.role === "admin";

  return {
    user,
    isAuthenticated,
    isAdmin,
    isVendorUser,
    isPendingApproval,
    isLoading: status === "loading",
    sessionChecked,
    login: (payload) => dispatch(loginUser(payload)),
    logout: () => dispatch(logoutUser()),
  };
};
