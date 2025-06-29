import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import api from '../api';

interface SignUpData {
  username: string;
  password: string;
  role: string;
}

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  role: yup.string().required('Role is required'),
});

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<SignUpData> = async data => {
    try {
      const response = await api.post('/users', data);
      console.log(response.data);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 mb-4 md:text-2xl dark:text-white">
          Create an Account
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Username:
            </label>
            <input
              type="text"
              id="username"
              {...register('username')}
              placeholder="username"
              className="mb-4 block text-gray-900 w-full rounded-md border border-gray-300 p-2.5 shadow-sm"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Password:
            </label>
            <input
              type="password"
              id="password"
              {...register('password')}
              placeholder="••••••••"
              className="mb-4 block text-gray-900 w-full rounded-md border border-gray-300 p-2.5 shadow-sm"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <div>
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Role:
            </label>
            <select
              id="role"
              {...register('role')}
              className="mb-4 block w-full rounded-md text-black border border-gray-300 p-2.5 shadow-sm">
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
              <option value="supervisor">Supervisor</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-medium text-sm px-5 py-2.5 text-center rounded-md hover:bg-indigo-700">
            Register
          </button>
          <hr />
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
