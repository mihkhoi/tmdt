import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

type Props = {
  children: ReactNode; // <-- dùng ReactNode thay cho JSX.Element
  requireAdmin?: boolean;
};

const ProtectedRoute: React.FC<Props> = ({ children, requireAdmin }) => {
  const auth = useSelector((s: RootState) => s.auth);

  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && auth.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // ép kiểu cho chắc
  return <>{children}</>;
};

export default ProtectedRoute;
