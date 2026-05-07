import {
  divider,
  errorClass,
  formCard,
  formGroup,
  formTitle,
  inputClass,
  labelClass,
  pageBackground,
  submitBtn,
  mutedText,
  loadingClass,
} from "../styles/common";

import { useForm } from "react-hook-form";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import axios from "axios";

import { toast } from "react-hot-toast";

// Axios instance
const API = axios.create({
  baseURL:
    "https://blog-backend-1-jcc4.onrender.com",
  withCredentials: true,
});

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] =
    useState(false);

  const [apiError, setApiError] =
    useState(null);

  // Register user
  const onUserRegister = async (
    userObj
  ) => {
    console.log(userObj);

    setApiError(null);

    try {
      setLoading(true);

      // API request
      const res = await API.post(
        "/common-api/common",
        userObj
      );

      console.log(res.data);

      // Success
      if (res.status === 201) {
        toast.success(
          "Registration successful"
        );

        reset();

        navigate("/login");
      }
    } catch (err) {
      console.log(
        "Registration Error:",
        err
      );

      setApiError(
        err.response?.data?.err ||
          err.response?.data
            ?.error ||
          err.response?.data
            ?.message ||
          err.message ||
          "Registration Failed"
      );

      toast.error(
        "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${pageBackground} flex items-center justify-center py-16 px-4`}
    >
      <div className={formCard}>
        {/* TITLE */}
        <h2 className={formTitle}>
          Create an Account
        </h2>

        {/* API ERROR */}
        {apiError && (
          <p className={errorClass}>
            {apiError}
          </p>
        )}

        {/* LOADING */}
        {loading && (
          <p className={loadingClass}>
            Registering...
          </p>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit(
            onUserRegister
          )}
        >
          {/* ROLE */}
          <div className="mb-5">
            <p className={labelClass}>
              Register as
            </p>

            <div className="flex gap-6 mt-2">
              {/* USER */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="USER"
                  {...register("role", {
                    required:
                      "Please select a role",
                  })}
                  className="accent-blue-600 w-4 h-4"
                />

                <span className="text-sm">
                  User
                </span>
              </label>

              {/* AUTHOR */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="AUTHOR"
                  {...register("role", {
                    required:
                      "Please select a role",
                  })}
                  className="accent-blue-600 w-4 h-4"
                />

                <span className="text-sm">
                  Author
                </span>
              </label>
            </div>

            {errors.role && (
              <p className={errorClass}>
                {
                  errors.role
                    .message
                }
              </p>
            )}
          </div>

          <div className={divider} />

          {/* NAME SECTION */}
          <div className="sm:flex gap-4 mb-4">
            {/* FIRST NAME */}
            <div className="flex-1">
              <label
                className={labelClass}
              >
                First Name
              </label>

              <input
                type="text"
                className={inputClass}
                placeholder="First name"
                {...register(
                  "firstName",
                  {
                    required:
                      "First name is required",

                    minLength: {
                      value: 2,
                      message:
                        "At least 2 characters required",
                    },

                    maxLength: {
                      value: 30,
                      message:
                        "Max 30 characters allowed",
                    },

                    validate: (
                      value
                    ) =>
                      value.trim()
                        .length >
                        0 ||
                      "Cannot be empty",
                  }
                )}
              />

              {errors.firstName && (
                <p
                  className={
                    errorClass
                  }
                >
                  {
                    errors
                      .firstName
                      .message
                  }
                </p>
              )}
            </div>

            {/* LAST NAME */}
            <div className="flex-1">
              <label
                className={labelClass}
              >
                Last Name
              </label>

              <input
                type="text"
                className={inputClass}
                placeholder="Last name"
                {...register(
                  "lastName",
                  {
                    maxLength: {
                      value: 30,
                      message:
                        "Max 30 characters allowed",
                    },
                  }
                )}
              />

              {errors.lastName && (
                <p
                  className={
                    errorClass
                  }
                >
                  {
                    errors
                      .lastName
                      .message
                  }
                </p>
              )}
            </div>
          </div>

          {/* EMAIL */}
          <div className={formGroup}>
            <label className={labelClass}>
              Email
            </label>

            <input
              type="email"
              className={inputClass}
              placeholder="you@example.com"
              {...register("email", {
                required:
                  "Email is required",

                pattern: {
                  value:
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message:
                    "Enter a valid email",
                },
              })}
            />

            {errors.email && (
              <p className={errorClass}>
                {
                  errors.email
                    .message
                }
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className={formGroup}>
            <label className={labelClass}>
              Password
            </label>

            <input
              type="password"
              className={inputClass}
              placeholder="Minimum 8 characters"
              {...register(
                "password",
                {
                  required:
                    "Password is required",

                  minLength: {
                    value: 8,
                    message:
                      "Password must be at least 8 characters",
                  },
                }
              )}
            />

            {errors.password && (
              <p className={errorClass}>
                {
                  errors.password
                    .message
                }
              </p>
            )}
          </div>

          {/* PROFILE IMAGE */}
          <div className={formGroup}>
            <label className={labelClass}>
              Profile Image URL
            </label>

            <input
              type="text"
              className={inputClass}
              placeholder="https://example.com/profile.jpg"
              {...register(
                "profileImageUrl"
              )}
            />

            {errors.profileImageUrl && (
              <p className={errorClass}>
                {
                  errors
                    .profileImageUrl
                    .message
                }
              </p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className={submitBtn}
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        {/* FOOTER */}
        <p
          className={`${mutedText} text-center mt-5`}
        >
          Already have an
          account?{" "}
          <NavLink
            to="/login"
            className="text-[#0066cc] font-medium"
          >
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;