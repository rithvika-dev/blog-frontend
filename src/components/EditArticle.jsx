import { useForm } from "react-hook-form";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useEffect, useState } from "react";

import axios from "axios";

import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
} from "../styles/common";

// Reusable axios instance
const API = axios.create({
  baseURL: "https://blog-backend-1-jcc4.onrender.com",
  withCredentials: true,
});

function EditArticle() {
  const location = useLocation();

  const navigate = useNavigate();

  const { id } = useParams();

  const article = location.state;

  const [loading, setLoading] = useState(false);

  const [serverError, setServerError] =
    useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Prefill form
  useEffect(() => {
    if (!article) return;

    setValue("title", article.title);

    setValue("category", article.category);

    setValue("content", article.content);
  }, [article, setValue]);

  // Update article
  const updateArticle = async (
    modifiedArticle
  ) => {
    setLoading(true);

    setServerError(null);

    try {
      // Add articleId
      modifiedArticle.articleId =
        article._id;

      // API call
      const res = await API.put(
        "/author-api/article",
        modifiedArticle
      );

      // Navigate to updated article
      if (res.status === 200) {
        navigate(
          `/article/${article._id}`,
          {
            state: res.data.payload,
          }
        );
      }
    } catch (err) {
      console.log(err);

      setServerError(
        err.response?.data?.message ||
          "Failed to update article"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${formCard} mt-10`}>
      {/* Title */}
      <h2 className={formTitle}>
        Edit Article
      </h2>

      {/* Server Error */}
      {serverError && (
        <p className={`${errorClass} mb-4`}>
          {serverError}
        </p>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit(
          updateArticle
        )}
      >
        {/* Article Title */}
        <div className={formGroup}>
          <label className={labelClass}>
            Title
          </label>

          <input
            className={inputClass}
            placeholder="Enter article title"
            {...register("title", {
              required:
                "Title is required",
            })}
          />

          {errors.title && (
            <p className={errorClass}>
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className={formGroup}>
          <label className={labelClass}>
            Category
          </label>

          <select
            className={inputClass}
            {...register("category", {
              required:
                "Category is required",
            })}
          >
            <option value="">
              Select category
            </option>

            <option value="technology">
              Technology
            </option>

            <option value="programming">
              Programming
            </option>

            <option value="ai">
              AI
            </option>

            <option value="web-development">
              Web Development
            </option>
          </select>

          {errors.category && (
            <p className={errorClass}>
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Content */}
        <div className={formGroup}>
          <label className={labelClass}>
            Content
          </label>

          <textarea
            rows="14"
            className={inputClass}
            placeholder="Write your article content here..."
            {...register("content", {
              required:
                "Content is required",
            })}
          />

          {errors.content && (
            <p className={errorClass}>
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={submitBtn}
          disabled={loading}
        >
          {loading
            ? "Updating..."
            : "Update Article"}
        </button>
      </form>
    </div>
  );
}

export default EditArticle;