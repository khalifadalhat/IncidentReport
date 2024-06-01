import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignUpData {
  username: string;
  password: string;
  role: string;
}

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpData>({
    username: "",
    password: "",
    role: "",
  });

  const handleChange = <T extends EventTarget>(
    event: React.ChangeEvent<T>
  ): void => {
    const { name, value } = event.target as HTMLInputElement & T;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/users/signup",
        formData
      );
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }

    setFormData({ username: "", password: "", role: "" });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 mb-4 md:text-2xl dark:text-white">
          Create an Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Userame:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mb-4 block w-full rounded-md border border-gray-300 p-2.5 shadow-sm"
            />
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
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mb-4 block w-full rounded-md border border-gray-300 p-2.5 shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Role:
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="mb-4 block w-full rounded-md text-black border border-gray-300 p-2.5 shadow-sm"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-medium text-sm px-5 py-2.5 text-center rounded-md hover:bg-indigo-700"
          >
            Register
          </button>
          <hr />
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <a
              href="/"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
