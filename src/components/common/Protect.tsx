// components/common/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import dayjs from "dayjs";

export const ProtectedRoute: React.FC = () => {
  const token = sessionStorage.getItem("token");
  const expiresAt = sessionStorage.getItem("expiresAt");

  if (!token || !expiresAt) {
    return <Navigate to="/signin" replace />;
  }

  const isExpired = dayjs().isAfter(dayjs(expiresAt));

  if (isExpired) {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiresAt");
    sessionStorage.clear();
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};
