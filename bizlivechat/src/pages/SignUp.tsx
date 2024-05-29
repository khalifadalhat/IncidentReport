import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SignUpData {
  username: string;
  password: string;
  role: string;
}

const SignupForm: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<SignUpData>({
    username: '',
    password: '',
    role: '',
  });

  const handleChange = <T extends EventTarget>(event: React.ChangeEvent<T>): void => {
    const { name, value } = event.target as HTMLInputElement & T; 
    setFormData({ ...formData, [name]: value });
  };
  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/users/signup', formData);
      console.log(response.data); 
      navigate('/login'); 
    } catch (error) {
      console.error(error);
    }

    setFormData({ username: '', password: '', role: '' });
  };

  return (
    <div className="signup-form container mx-auto p-4">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="fullName" className="text-sm font-medium">
            User Name:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-medium">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="role" className="text-sm font-medium">
            Role:
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="supervisor">Supervisor</option>
          </select>
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          Sign Up
        </button>
        <hr />
        <p>Do you have an account? <a href="login">Login</a></p>
      </form>
    </div>
  );
};

export default SignupForm;
