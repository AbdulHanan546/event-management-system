import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus('');
      return;
    }

    setIsLoading(true);
    setErrors({});
    setStatus('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token); // Store JWT

      // Optionally fetch user details with GET /api/auth/me
      try {
        const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${response.data.token}` },
        });
        // Store user details in context or state management (e.g., Redux) if needed
        console.log('User details:', userResponse.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }

      setStatus('Login successful!');
      setTimeout(() => navigate('/'), 2000); // Redirect to homepage after 2 seconds
    } catch (error) {
      setStatus(error.response?.data?.message || 'Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className={`w-full border p-3 rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className={`w-full border p-3 rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-600 text-white px-6 py-3 rounded-full w-full hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          {status && (
            <p className={`text-center ${status.includes('Error') || status.includes('Invalid') ? 'text-red-600' : 'text-green-600'}`}>
              {status}
            </p>
          )}
          <p className="text-center">
            Don't have an account? <Link to="/signup" className="text-blue-600">Signup</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;