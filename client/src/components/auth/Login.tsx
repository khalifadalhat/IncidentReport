import { useLogin } from "@/hook/useLogin";
import { useAuthStore } from "@/store/useAuthStore";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

export default function Login() {
  const { mutate: login, isPending } = useLogin();
  const { error, clearError } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fromSignup = searchParams.get("fromSignup");
    if (fromSignup === "true") {
      setIsSuccess(true);
      const timer = setTimeout(() => setIsSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formState.email, formState.password, clearError, error]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormState((prev) => ({
        ...prev,
        email: savedEmail,
        rememberMe: true,
      }));
    }
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateForm = () => {
    const errors = {
      email: !formState.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        ? "Please enter a valid email address"
        : "",
      password:
        formState.password.length < 6
          ? "Password must be at least 6 characters"
          : "",
    };
    return errors;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSuccess(false);

    const errors = validateForm();
    const hasErrors = Object.values(errors).some((error) => error);

    if (hasErrors) {
      setTouched({ email: true, password: true });
      return;
    }

    if (formState.rememberMe) {
      localStorage.setItem("rememberedEmail", formState.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    login({
      email: formState.email.trim().toLowerCase(),
      password: formState.password,
    });
  };

  const errors = validateForm();
  const canSubmit =
    formState.email &&
    formState.password &&
    !Object.values(errors).some((error) => error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success Message */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-3 text-green-400">
              <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Account created successfully!</p>
                <p className="text-sm text-green-300/80 mt-1">
                  Please log in with your credentials.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="backdrop-blur-xl p-8 rounded-2xl bg-white/5 shadow-2xl border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiLock className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400">
              Sign in to your IncidentFlow account
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formState.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 
                    text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                    outline-none transition-all duration-200 backdrop-blur-sm"
                  required
                  autoComplete="email"
                />
              </div>
              {touched.email && errors.email && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <FiAlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formState.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  onBlur={() => handleBlur("password")}
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 
                    text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                    outline-none transition-all duration-200 backdrop-blur-sm"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <FiAlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.rememberMe}
                  onChange={(e) =>
                    handleInputChange("rememberMe", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                />
                <span className="text-gray-400 text-sm">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending || !canSubmit}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 
                hover:from-blue-500 hover:to-indigo-500 text-white font-semibold 
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-8 pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/5">
            <p className="text-gray-500 text-xs text-center">
              🔒 Your data is securely encrypted and protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
