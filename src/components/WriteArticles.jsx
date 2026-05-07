import { useForm } from "react-hook-form";

import { useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";

import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  loadingClass,
} from "../styles/common";

import { useAuth } from "../store/authStore";

// Axios instance
const API = axios.create({
  baseURL:
    "https://blog-backend-1-jcc4.onrender.com",
  withCredentials: true,
});

function WriteArticles() {
  const navigate = useNavigate();

  const currentUser = useAuth(
    (state) => state.currentUser
  );

  const [loading, setLoading] =
    useState(false);

  const [serverError, setServerError] =
    useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Submit article
  const submitArticle = async (
    articleObj
  ) => {
    setLoading(true);

    setServerError(null);

    try {
      // Add author ID
      articleObj.author =
        currentUser._id;

      // API request
      const res = await API.post(
        "/author-api/article",
        articleObj
      );

      console.log(res.data);

      // Success
      if (res.status === 201) {
        toast.success(
          "Article published successfully"
        );

        reset();

        navigate(
          "../articles"
        );
      }
    } catch (err) {
      console.log(err);

      setServerError(
        err.response?.data
          ?.error ||
          err.response?.data
            ?.message ||
          "Failed to publish article"
      );

      toast.error(
        "Failed to publish article"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={formCard}>
      {/* TITLE */}
      <h2 className={formTitle}>
        Write New Article
      </h2>

      {/* SERVER ERROR */}
      {serverError && (
        <p className={errorClass}>
          {serverError}
        </p>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit(
          submitArticle
        )}
      >
        {/* TITLE */}
        <div className={formGroup}>
          <label className={labelClass}>
            Title
          </label>

          <input
            type="text"
            className={inputClass}
            placeholder="Enter article title"
            {...register("title", {
              required:
                "Title is required",

              minLength: {
                value: 5,
                message:
                  "Title must be at least 5 characters",
              },
            })}
          />

          {errors.title && (
            <p className={errorClass}>
              {
                errors.title
                  .message
              }
            </p>
          )}
        </div>

        {/* CATEGORY */}
        <div className={formGroup}>
          <label className={labelClass}>
            Category
          </label>

          <select
            className={inputClass}
            {...register(
              "category",
              {
                required:
                  "Category is required",
              }
            )}
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
              {
                errors
                  .category
                  .message
              }
            </p>
          )}
        </div>

        {/* CONTENT */}
        <div className={formGroup}>
          <label className={labelClass}>
            Content
          </label>

          <textarea
            rows="10"
            className={inputClass}
            placeholder="Write your article content..."
            {...register("content", {
              required:
                "Content is required",

              minLength: {
                value: 50,
                message:
                  "Content must be at least 50 characters",
              },
            })}
          />

          {errors.content && (
            <p className={errorClass}>
              {
                errors.content
                  .message
              }
            </p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          className={submitBtn}
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Publishing..."
            : "Publish Article"}
        </button>

        {/* LOADING */}
        {loading && (
          <p className={loadingClass}>
            Publishing article...
          </p>
        )}
      </form>
    </div>
  );
}

export default WriteArticles;