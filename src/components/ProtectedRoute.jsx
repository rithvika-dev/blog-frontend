import { useEffect } from "react";

import { Navigate } from "react-router-dom";

import { toast } from "react-hot-toast";

import { useAuth } from "../store/authStore";

function ProtectedRoute({
  children,
  allowedRoles,
}) {
  // Get auth state
  const {
    loading,
    currentUser,
    isAuthenticated,
  } = useAuth();

  // Show toast only once
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error(
        "Please login to continue"
      );
    }
  }, [loading, isAuthenticated]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-[#6e6e73] text-lg">
          Loading...
        </p>
      </div>
    );
  }

  // User not logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Role authorization check
  if (
    allowedRoles &&
    !allowedRoles.includes(
      currentUser?.role
    )
  ) {
    toast.error(
      "Unauthorized access"
    );

    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{
          redirectTo: "/",
        }}
      />
    );
  }

  // Authorized
  return children;
}

export default ProtectedRoute;