import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuthenticated = useSelector((s: RootState) => s.user.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
