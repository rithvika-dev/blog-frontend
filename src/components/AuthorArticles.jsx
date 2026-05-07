import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";

import {
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  ghostBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
  articleStatusActive,
  articleStatusDeleted,
} from "../styles/common";

// Reusable axios instance
const API = axios.create({
  baseURL: "https://blog-backend-1-jcc4.onrender.com",
  withCredentials: true,
});

function AuthorArticles() {
  const navigate = useNavigate();

  const user = useAuth((state) => state.currentUser);

  const [articles, setArticles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  console.log("user in author profile", user);

  // Fetch author articles
  useEffect(() => {
    if (!user?._id) return;

    const getAuthorArticles = async () => {
      setLoading(true);

      try {
        const res = await API.get(
          `/author-api/articles/${user._id}`
        );

        if (res.status === 200) {
          setArticles(res.data.payload || []);
        }
      } catch (err) {
        console.log(err);

        setError(
          err.response?.data?.message ||
            "Failed to fetch articles"
        );
      } finally {
        setLoading(false);
      }
    };

    getAuthorArticles();
  }, [user]);

  // Open article page
  const openArticle = (article) => {
    navigate(`/article/${article._id}`, {
      state: article,
    });
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString(
      "en-IN",
      {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
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

  // Error state
  if (error) {
    return (
      <p className={errorClass}>{error}</p>
    );
  }

  // Empty state
  if (articles.length === 0) {
    return (
      <div className={emptyStateClass}>
        You haven't published any articles yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {articles.map((article) => (
        <div
          key={article._id}
          className={`${articleCardClass} relative flex flex-col`}
        >
          {/* Status Badge */}
          <span
            className={
              article.isArticleActive
                ? articleStatusActive
                : articleStatusDeleted
            }
          >
            {article.isArticleActive
              ? "ACTIVE"
              : "DELETED"}
          </span>

          {/* Article Content */}
          <div className="flex flex-col gap-2">
            <p className={articleMeta}>
              {article.category}
            </p>

            <p className={articleTitle}>
              {article.title}
            </p>

            <p className={articleExcerpt}>
              {article.content.slice(0, 60)}
              ...
            </p>

            <p className="text-xs text-[#8e8e93] mt-1">
              {formatDate(article.createdAt)}
            </p>
          </div>

          {/* Read Button */}
          <button
            className={`${ghostBtn} mt-auto pt-4`}
            onClick={() => openArticle(article)}
          >
            Read Article →
          </button>
        </div>
      ))}
    </div>
  );
}

export default AuthorArticles;