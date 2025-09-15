import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      localStorage.setItem('token', response.data.token); // Store JWT
      setStatus('Signup successful! Please login.');
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      setStatus(error.response?.data?.message || 'Error during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Signup</h2>
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              className={`w-full border p-3 rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
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
            {isLoading ? 'Signing up...' : 'Signup'}
          </button>
          {status && (
            <p className={`text-center ${status.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {status}
            </p>
          )}
          <p className="text-center">
            Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;