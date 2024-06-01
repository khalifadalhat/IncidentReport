import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface LoginData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (role: string) => {
    try {
      const { username, password } = formData;

      const response = await axios.post("http://localhost:5000/users/login", {
        username,
        password,
        role,
      });

      if (response.status === 200 && response.data.token) {
        Cookies.set("token", response.data.token);
        navigate(`/${role}/dashboard`);
      } else {
        setError(response.data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed: " + (error || "Unknown error"));
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 ">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form className="space-y-4 md:space-y-6" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mb-4 block w-full rounded-md border border-gray-300 p-2.5 shadow-sm"
          />
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mb-4 block w-full rounded-md border border-gray-300 p-2.5 shadow-sm"
          />
          <button
            onClick={() => handleLogin("admin")}
            className="bg-blue-500  text-white font-medium text-sm px-5 py-2.5 text-center rounded-md w-full"
          >
            Login as Admin
          </button>
          <button
            onClick={() => handleLogin("agent")}
            className="bg-blue-500  text-white font-medium text-sm px-5 py-2.5 text-center rounded-md w-full"
          >
            Login as Agent
          </button>
          <button
            onClick={() => handleLogin("supervisor")}
            className="bg-blue-500 text-white font-medium text-sm px-5 py-2.5 text-center rounded-md w-full"
          >
            Login as Supervisor
          </button>
          <hr />
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Don't have an account? <a href="signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">signup</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
