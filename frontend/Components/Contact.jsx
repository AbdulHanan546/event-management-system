import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
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
    if (!formData.message.trim()) newErrors.message = 'Message is required';
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
      await axios.post('http://localhost:5000/api/messages', formData);
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus(error.response?.data?.message || 'Error sending message.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
      <div className="max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your Name"
              className={`w-full border p-3 rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Your Email"
              className={`w-full border p-3 rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <textarea
              placeholder="Your Message"
              className={`w-full border p-3 rounded h-32 ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-600 text-white px-6 py-3 rounded-full w-full hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
          {status && (
            <p className={`text-center ${status.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;