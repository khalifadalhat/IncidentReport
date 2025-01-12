import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import api from "../api";

interface LoginData {
  username: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: yupResolver(schema),
  });
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      const response = await api.post("/users/login", data);
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role); 

      // Redirect based on role
      const role = response.data.user.role;
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "agent") {
        navigate("/agent/dashboard");
      } else if (role === "supervisor") {
        navigate("/supervisor/dashboard");
      } else {
        throw new Error("Invalid role");
      }
    } catch (error) {
      console.error(error);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 mb-4 md:text-2xl dark:text-white">
          Login
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              {...register("username")}
              placeholder="username"
              className="mb-4 block w-full rounded-md border border-gray-300 p-2.5 shadow-sm"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              placeholder="••••••••"
              className="mb-4 block w-full rounded-md border border-gray-300 p-2.5 shadow-sm"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-medium text-sm px-5 py-2.5 text-center rounded-md hover:bg-indigo-700"
          >
            Login
          </button>
          <hr />
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
