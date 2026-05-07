import { useForm } from "react-hook-form";

import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  linkClass,
  loadingClass,
} from "../styles/common";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../store/authStore";

import { useEffect } from "react";

import { toast } from "react-hot-toast";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  // Zustand auth store
  const {
    login,
    currentUser,
    loading,
    error,
    isAuthenticated,
  } = useAuth((state) => state);

  // Handle login
  const onUserLogin = async (
    userCredObj
  ) => {
    try {
      await login(userCredObj);
    } catch (err) {
      console.log(err);
    }
  };

  // Redirect after login
  useEffect(() => {
    if (
      isAuthenticated === true &&
      currentUser
    ) {
      if (currentUser.role === "USER") {
        toast.success(
          "Login successful! Redirecting to User Profile",
          {
            duration: 2000,
          }
        );

        navigate("/user-profile");
      }

      if (
        currentUser.role === "AUTHOR"
      ) {
        toast.success(
          "Login successful! Redirecting to Author Profile",
          {
            duration: 2000,
          }
        );

        navigate("/author-profile");
      }

      if (
        currentUser.role === "ADMIN"
      ) {
        toast.success(
          "Login successful! Redirecting to Admin Profile",
          {
            duration: 2000,
          }
        );

        navigate("/admin-profile");
      }
    }
  }, [
    isAuthenticated,
    currentUser,
    navigate,
  ]);

  // Loading state
  if (loading) {
    return (
      <p className={loadingClass}>
        Loading...
      </p>
    );
  }

  return (
    <div
      className={`${pageBackground} flex items-center justify-center py-16 px-4`}
    >
      <div className={formCard}>
        {/* Title */}
        <h2 className={formTitle}>
          Sign In
        </h2>

        {/* API Error */}
        {error && (
          <p className={errorClass}>
            {error}
          </p>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleSubmit(
            onUserLogin
          )}
        >
          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              {...register("email", {
                required:
                  "Email is required",

                validate: (
                  value
                ) =>
                  value.trim()
                    .length > 0 ||
                  "Email cannot be empty",
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

          {/* Password */}
          <div className={formGroup}>
            <label className={labelClass}>
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className={inputClass}
              {...register(
                "password",
                {
                  required:
                    "Password is required",

                  validate: (
                    value
                  ) =>
                    value.trim()
                      .length >
                      0 ||
                    "Password cannot be empty",
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

          {/* Forgot Password */}
          <div className="text-right -mt-2 mb-4">
            <NavLink
              to="/forgot-password"
              className={`${linkClass} text-xs`}
            >
              Forgot password?
            </NavLink>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={submitBtn}
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p
          className={`${mutedText} text-center mt-5`}
        >
          Don't have an account?{" "}
          <NavLink
            to="/register"
            className={linkClass}
          >
            Create one
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;