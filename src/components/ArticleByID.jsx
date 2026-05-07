import {
  useParams,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { useForm } from "react-hook-form";

import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  loadingClass,
  errorClass,
  inputClass,
  commentsWrapper,
  commentCard,
  commentHeader,
  commentUserRow,
  avatar,
  commentUser,
  commentTime,
  commentText,
} from "../styles/common.js";

// Reusable axios instance
const API = axios.create({
  baseURL: "https://blog-backend-1-jcc4.onrender.com",
  withCredentials: true,
});

function ArticleByID() {
  const { id } = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(
    location.state || null
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  // Fetch article
  useEffect(() => {
    if (article) return;

    const getArticle = async () => {
      setLoading(true);

      try {
        const res = await API.get(
          `/user-api/article/${id}`
        );

        setArticle(res.data.payload);
      } catch (err) {
        console.log(err);

        setError(
          err.response?.data?.message ||
            "Unable to load article"
        );
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id, article]);

  // Format IST date
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Delete / Restore Article
  const toggleArticleStatus = async () => {
    const newStatus = !article.isArticleActive;

    const confirmMsg = newStatus
      ? "Restore this article?"
      : "Delete this article?";

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await API.patch(
        "/author-api/articles",
        {
          articleId: article._id,
          isArticleActive: newStatus,
        }
      );

      setArticle(res.data.payload);
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
          "Operation failed"
      );
    }
  };

  // Edit article
  const editArticle = (articleObj) => {
    navigate("/edit-article", {
      state: articleObj,
    });
  };

  // Add comment
  const addComment = async (commentObj) => {
    try {
      const payload = {
        ...commentObj,
        articleId: article._id,
      };

      const res = await API.put(
        "/user-api/comment",
        payload
      );

      if (res.status === 200) {
        setArticle(res.data.payload);

        reset();
      }
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
          "Unable to add comment"
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <p className={loadingClass}>
        Loading article...
      </p>
    );
  }

  // Error state
  if (error) {
    return <p className={errorClass}>{error}</p>;
  }

  // Empty state
  if (!article) {
    return null;
  }

  return (
    <div className={articlePageWrapper}>
      {/* Article Header */}
      <div className={articleHeader}>
        <span className={articleCategory}>
          {article.category}
        </span>

        <h1 className={`${articleMainTitle} uppercase`}>
          {article.title}
        </h1>

        <div className={articleAuthorRow}>
          <div className={authorInfo}>
            ✍️{" "}
            {article.author?.firstName || "Author"}
          </div>

          <div>
            {formatDate(article.createdAt)}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className={articleContent}>
        {article.content}
      </div>

      {/* Author Actions */}
      {user?.role === "AUTHOR" && (
        <div className={articleActions}>
          <button
            className={editBtn}
            onClick={() => editArticle(article)}
          >
            Edit
          </button>

          <button
            className={deleteBtn}
            onClick={toggleArticleStatus}
          >
            {article.isArticleActive
              ? "Delete"
              : "Restore"}
          </button>
        </div>
      )}

      {/* User Comments */}
      {user?.role === "USER" && (
        <div className={articleActions}>
          <form
            onSubmit={handleSubmit(addComment)}
          >
            <input
              type="text"
              {...register("comment", {
                required: true,
              })}
              className={inputClass}
              placeholder="Write your comment here..."
            />

            <button
              type="submit"
              className="bg-amber-600 text-white px-5 py-2 rounded-2xl mt-5"
            >
              Add comment
            </button>
          </form>
        </div>
      )}

      {/* Comments Section */}
      <div className={commentsWrapper}>
        {article.comments?.length === 0 && (
          <p className="text-[#a1a1a6] text-sm text-center">
            No comments yet
          </p>
        )}

        {article.comments?.map(
          (commentObj, index) => {
            const name =
              commentObj.user?.email || "User";

            const firstLetter = name
              .charAt(0)
              .toUpperCase();

            return (
              <div
                key={index}
                className={commentCard}
              >
                <div className={commentHeader}>
                  <div className={commentUserRow}>
                    <div className={avatar}>
                      {firstLetter}
                    </div>

                    <div>
                      <p className={commentUser}>
                        {name}
                      </p>

                      <p className={commentTime}>
                        {formatDate(
                          commentObj.createdAt ||
                            new Date()
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <p className={commentText}>
                  {commentObj.comment}
                </p>
              </div>
            );
          }
        )}
      </div>

      {/* Footer */}
      <div className={articleFooter}>
        Last updated:{" "}
        {formatDate(article.updatedAt)}
      </div>
    </div>
  );
}

export default ArticleByID;