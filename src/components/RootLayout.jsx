import { Outlet } from "react-router-dom";

import { useEffect } from "react";

import Header from "./Header";
import Footer from "./Footer";

import { useAuth } from "../store/authStore";

function RootLayout() {
  // Zustand auth function
  const checkAuth = useAuth(
    (state) => state.checkAuth
  );

  // Check authentication on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default RootLayout;