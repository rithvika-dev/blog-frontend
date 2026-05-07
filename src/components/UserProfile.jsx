import { useAuth } from "../store/authStore";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import { useEffect, useState } from "react";

import {
  articleGrid,
  articleCardClass,
  articleTitle,
  ghostBtn,
  loadingClass,
  errorClass,
  timestampClass,
} from "../styles/common.js";

// Axios instance
const API = axios.create({
  baseURL:
    "https://blog-backend-1-jcc4.onrender.com",
  withCredentials: true,
});

function UserProfile() {
  const logout = useAuth(
    (state) => state.logout
  );

  const currentUser = useAuth(
    (state) => state.currentUser
  );

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [articles, setArticles] =
    useState([]);

  // Fetch all articles
  useEffect(() => {
    const getArticles =
      async () => {
        setLoading(true);

        setError(null);

        try {
          // Read articles
          const res =
            await API.get(
              "/user-api/articles"
            );

          // Update state
          if (res.status === 200) {
            setArticles(
              res.data.payload ||
                []
            );
          }
        } catch (err) {
          console.log(err);

          setError(
            err.response?.data
              ?.error ||
              err.response?.data
                ?.message ||
              "Something went wrong"
          );
        } finally {
          setLoading(false);
        }
      };

    getArticles();
  }, []);

  // Convert UTC → IST
  const formatDateIST = (
    date
  ) => {
    return new Date(
      date
    ).toLocaleString("en-IN", {
      timeZone:
        "Asia/Kolkata",

      dateStyle: "medium",

      timeStyle: "short",
    });
  };

  // Logout
  const onLogout =
    async () => {
      try {
        await logout();

        navigate("/login");
      } catch (err) {
        console.log(err);
      }
    };

  // Open article
  const navigateToArticleByID =
    (articleObj) => {
      navigate(
        `/article/${articleObj._id}`,
        {
          state: articleObj,
        }
      );
    };

  // Loading state
  if (loading) {
    return (
      <p className={loadingClass}>
        Loading articles...
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* ERROR */}
      {error && (
        <p className={errorClass}>
          {error}
        </p>
      )}

      {/* PROFILE HEADER */}
      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 mb-10 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {currentUser?.profileImageUrl ? (
            <img
              src={
                currentUser.profileImageUrl
              }
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
              {
                currentUser?.firstName
              }
            </h2>

            <p className="text-sm text-[#8e8e93] mt-1">
              Explore latest
              articles from
              authors
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

      {/* ARTICLES SECTION */}
      <div>
        <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-6">
          Latest Articles
        </h3>

        {/* EMPTY STATE */}
        {articles.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#e8e8ed] py-14 text-center">
            <p className="text-[#8e8e93] text-sm">
              No articles available
              yet
            </p>
          </div>
        ) : (
          <div className={articleGrid}>
            {articles.map(
              (articleObj) => (
                <div
                  className={`${articleCardClass} flex flex-col`}
                  key={
                    articleObj._id
                  }
                >
                  {/* Article Info */}
                  <div>
                    <p
                      className={
                        articleTitle
                      }
                    >
                      {
                        articleObj.title
                      }
                    </p>

                    <p className="text-sm text-[#6e6e73] mt-2">
                      {articleObj.content.slice(
                        0,
                        100
                      )}
                      ...
                    </p>

                    <p
                      className={`${timestampClass} mt-3`}
                    >
                      {formatDateIST(
                        articleObj.createdAt
                      )}
                    </p>
                  </div>

                  {/* Action */}
                  <button
                    className={`${ghostBtn} mt-auto pt-5`}
                    onClick={() =>
                      navigateToArticleByID(
                        articleObj
                      )
                    }
                  >
                    Read Article →
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;