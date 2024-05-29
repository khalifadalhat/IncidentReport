import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface LoginData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (role: string) => {
    try {
      const { username, password } = formData; 

      const response = await axios.post('http://localhost:5000/users/login', {
        username,
        password,
        role,
      });

      if (response.status === 200 && response.data.token) {
        Cookies.set('token', response.data.token);
        navigate(`/${role}/dashboard`);
      } else {
        setError(response.data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed: ' + (error || 'Unknown error'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mb-4 block w-full rounded-md border border-gray-300 p-2.5 shadow-sm"
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mb-4 block w-full rounded-md border border-gray-300 p-2.5 shadow-sm"
          />
          <button onClick={() => handleLogin('admin')} className="bg-blue-500 text-white p-2 rounded mb-2 w-full">Login as Admin</button>
          <button onClick={() => handleLogin('agent')} className="bg-green-500 text-white p-2 rounded mb-2 w-full">Login as Agent</button>
          <button onClick={() => handleLogin('supervisor')} className="bg-yellow-500 text-white p-2 rounded w-full">Login as Supervisor</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
