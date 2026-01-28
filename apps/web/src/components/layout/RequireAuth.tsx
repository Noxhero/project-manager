import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((s) => s.auth.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
