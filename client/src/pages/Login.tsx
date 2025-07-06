import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import api from "../utils/api";
import { setCookie } from "../utils/cookie";

interface LoginData {
  username: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .email("Must be a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Must contain uppercase, number, and special character"
    ),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: yupResolver(schema),
  });

  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [securityLevel, setSecurityLevel] = React.useState<number>(0);

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      setError(null);

      const response = await api.post("/auth/login", {
        email: data.username,
        password: data.password,
      });

      setCookie("token", response.data.token);
      setCookie("userData", JSON.stringify(response.data.user));

      if (response.data.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (response.data.user.role === "agent") {
        navigate("/agent/dashboard", { replace: true });
      } else {
        setError("Unknown user role.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials or insufficient privileges");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    let level = 0;

    // Basic security level calculation
    if (password.length >= 8) level += 1;
    if (/[A-Z]/.test(password)) level += 1;
    if (/\d/.test(password)) level += 1;
    if (/[@$!%*?&]/.test(password)) level += 1;

    setSecurityLevel(level);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Security Header */}
        <div className="bg-indigo-700 p-6 text-white text-center">
          <div className="flex items-center justify-center mb-3">
            <FiShield className="text-3xl mr-2" />
            <h1 className="text-2xl font-bold">Admin Portal</h1>
          </div>
          <p className="text-indigo-100 text-sm">
            Restricted access to authorized personnel only
          </p>
        </div>

        <div className="p-8">
          {/* Security Indicator */}
          {securityLevel > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Password Strength</span>
                <span>
                  {securityLevel < 2
                    ? "Weak"
                    : securityLevel < 4
                    ? "Good"
                    : "Strong"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    securityLevel < 2
                      ? "bg-red-500"
                      : securityLevel < 4
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${securityLevel * 25}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                {...register("username")}
                placeholder="Admin username"
                className={`w-full pl-10 pr-4 py-3 border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition`}
                disabled={isSubmitting}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password", {
                  onChange: handlePasswordChange,
                })}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-3 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition`}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                ) : (
                  <FiEye className="text-gray-400 hover:text-gray-600" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${
                isSubmitting
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                "Login"
              )}
            </button>

            {/* Security Notice */}
            <div className="text-center text-xs text-gray-500 mt-6">
              <p className="flex items-center justify-center">
                <FiShield className="mr-1" />
                All login attempts are logged and monitored
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
