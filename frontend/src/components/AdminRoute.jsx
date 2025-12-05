import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!token || !user) return <Navigate to="/login" replace />;

  if (user.role !== "Admin") return <Navigate to="/not-authorized" replace />;

  return children;
};

export default AdminRoute;
