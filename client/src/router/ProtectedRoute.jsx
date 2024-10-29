import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../api/api";

const ProtectedRoute = ({ element, requiredRole }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserRole = async () => {
      try {
        const response = await axios.get(`/${requiredRole}`);
        const role = response.data.role || requiredRole;
        console.log("AAAAAAAAAAAAAAAAAAA", response);
        console.log("User role:", role);

        setUserRole(role);
      } catch (error) {
        console.log("Role verification failed", error);
      } finally {
        setLoading(false);
      }
    };

    verifyUserRole();
  }, [requiredRole]);

  if (loading) return <div>Loading...</div>;

  return userRole === requiredRole ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
