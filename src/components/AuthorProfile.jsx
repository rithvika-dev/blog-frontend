import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../store/authStore";

import {
  pageWrapper,
  navLinkClass,
  divider,
} from "../styles/common";

function AuthorProfile() {
  const currentUser = useAuth(
    (state) => state.currentUser
  );

  const logout = useAuth(
    (state) => state.logout
  );

  const navigate = useNavigate();

  // Logout handler
  const onLogout = async () => {
    try {
      await logout();

      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={pageWrapper}>
      {/* PROFILE HEADER */}
      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              className="w-16 h-16 rounded-full object-cover border"
              alt="profile"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center text-xl font-semibold">
              {currentUser?.firstName
                ?.charAt(0)
                .toUpperCase()}
            </div>
          )}

          {/* User Info */}
          <div>
            <p className="text-sm text-[#6e6e73]">
              Welcome back
            </p>

            <h2 className="text-2xl font-semibold text-[#1d1d1f]">
              {currentUser?.firstName}
            </h2>

            <p className="text-sm text-[#8e8e93] mt-1">
              Author Dashboard
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          className="bg-[#ff3b30] text-white text-sm px-5 py-2 rounded-full hover:bg-[#d62c23] transition"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {/* NAVIGATION */}
      <div className="flex flex-wrap gap-3 mb-6 bg-[#f5f5f7] p-2 rounded-full w-fit">
        {/* Articles Tab */}
        <NavLink
          to="articles"
          className={({ isActive }) =>
            isActive
              ? "bg-white px-5 py-2 rounded-full text-[#0066cc] text-sm font-medium shadow-sm transition"
              : `${navLinkClass} px-5 py-2`
          }
        >
          Articles
        </NavLink>

        {/* Write Article Tab */}
        <NavLink
          to="write-article"
          className={({ isActive }) =>
            isActive
              ? "bg-white px-5 py-2 rounded-full text-[#0066cc] text-sm font-medium shadow-sm transition"
              : `${navLinkClass} px-5 py-2`
          }
        >
          Write Article
        </NavLink>
      </div>

      {/* Divider */}
      <div className={divider}></div>

      {/* Nested Routes Content */}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthorProfile;