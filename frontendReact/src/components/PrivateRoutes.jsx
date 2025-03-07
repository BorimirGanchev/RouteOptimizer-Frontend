import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/signin" />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/signin" />; 
  }

  return children;
};

export default PrivateRoute;
