import { Navigate } from "react-router-dom";
import { useAuth } from "./Provider";
import { useEffect } from "react";

export const AuthGuard = ({ children, allowedLevels }) => {
  const auth = useAuth();
  console.log(auth.user);

  if (!auth.user) {
    return <Navigate to="/" />;
  }

  if (allowedLevels && !allowedLevels.includes(auth.user.level)){
    return <Navigate to="/"/>;
  }

  return <>{children}</>;
};
