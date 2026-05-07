import { useEffect } from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

function Unauthorized({
  delay = 5000,
}) {
  const navigate = useNavigate();

  const location = useLocation();

  // Redirect destination
  const redirectTo =
    location.state?.redirectTo ||
    "/login";

  // Auto redirect
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectTo, {
        replace: true,
      });
    }, delay);

    return () =>
      clearTimeout(timer);
  }, [
    navigate,
    redirectTo,
    delay,
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] px-4">
      <div className="bg-white shadow-sm border border-[#e8e8ed] rounded-3xl p-10 text-center max-w-md w-full">
        {/* Error Code */}
        <h1 className="text-6xl font-bold text-[#ff3b30] mb-4">
          403
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-3">
          Unauthorized Access
        </h2>

        {/* Message */}
        <p className="text-[#6e6e73] mb-2">
          You don’t have permission
          to access this page.
        </p>

        {/* Redirect Message */}
        <p className="text-sm text-[#8e8e93]">
          Redirecting in{" "}
          {delay / 1000} seconds...
        </p>

        {/* Manual Button */}
        <button
          onClick={() =>
            navigate(redirectTo)
          }
          className="mt-6 bg-[#0066cc] hover:bg-[#0055b3] transition text-white px-5 py-2 rounded-full text-sm font-medium"
        >
          Go Now
        </button>
      </div>
    </div>
  );
}

export default Unauthorized;