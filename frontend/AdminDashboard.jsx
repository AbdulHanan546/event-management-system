import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [overview, setOverview] = useState({ totalEvents: 0, totalRegistrations: 0, latestMessages: [] });
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', location: '', date: '', price: '', imageUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    } else {
      fetchOverview();
      fetchEvents();
      fetchMessages();
    }
  }, [isAuthenticated, navigate]);

  // Fetch dashboard overview
  const fetchOverview = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard-overview', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOverview(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching dashboard overview.');
    }
  };

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEvents(response.data.events || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching events.');
    }
  };

  // Fetch all messages
  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/messages', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessages(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching messages.');
    }
  };

  // Fetch registered users for an event
  const fetchRegisteredUsers = async (eventId) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/api/registrations/event/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRegisteredUsers(response.data);
      setSelectedEventId(eventId);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching registered users.');
    } finally {
      setIsLoading(false);
    }
  };

  // Export registered users as CSV
  const handleExportCSV = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/registrations/event/${eventId}/export`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `event_${eventId}_registrations.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStatus('CSV exported successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Error exporting CSV.');
    }
  };

  // Handle event form submission (create or edit)
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!formData.title.trim()) validationErrors.title = 'Title is required';
    if (!formData.description.trim()) validationErrors.description = 'Description is required';
    if (!formData.category) validationErrors.category = 'Category is required';
    if (!formData.location.trim()) validationErrors.location = 'Location is required';
    if (!formData.date) validationErrors.date = 'Date is required';
    if (formData.price && isNaN(formData.price)) validationErrors.price = 'Price must be a number';

    if (Object.keys(validationErrors).length > 0) {
      setError('Please fill all required fields correctly.');
      return;
    }

    setIsLoading(true);
    setError('');
    setStatus('');

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        date: formData.date,
        price: formData.price ? Number(formData.price) : undefined,
        imageUrl: formData.imageUrl || undefined,
      };

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/events/${editEventId}`, eventData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setStatus('Event updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/events', eventData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setStatus('Event created successfully!');
      }
      setFormData({ title: '', description: '', category: '', location: '', date: '', price: '', imageUrl: '' });
      setIsEditing(false);
      setEditEventId(null);
      fetchEvents();
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving event.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle event edit
  const handleEditEvent = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      location: event.location,
      date: event.date.split('T')[0], // Format for input type="date"
      price: event.price || '',
      imageUrl: event.imageUrl || '',
    });
    setIsEditing(true);
    setEditEventId(event._id);
  };

  // Handle event delete
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setIsLoading(true);
    setError('');
    try {
      await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStatus('Event deleted successfully!');
      fetchEvents();
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting event.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/admin/login');
  };

  if (!isAuthenticated) return null; // Redirect handled by useEffect

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Error and Status Messages */}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {status && <p className="text-green-600 mb-4">{status}</p>}

      {/* Dashboard Overview */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <h4 className="text-lg font-semibold">Total Events</h4>
            <p className="text-2xl">{overview.totalEvents}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <h4 className="text-lg font-semibold">Total Registrations</h4>
            <p className="text-2xl">{overview.totalRegistrations}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <h4 className="text-lg font-semibold">Latest Messages</h4>
            <ul className="list-disc pl-5">
              {overview.latestMessages.slice(0, 3).map((msg) => (
                <li key={msg._id} className="truncate">
                  {msg.name}: {msg.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Event Management */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Event Management</h3>
        <form onSubmit={handleEventSubmit} className="space-y-4 mb-6 max-w-lg">
          <input
            type="text"
            placeholder="Event Title"
            className="w-full border p-3 rounded"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="w-full border p-3 rounded h-24"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <select
            className="w-full border p-3 rounded"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">Select Category</option>
            <option value="conference">Conference</option>
            <option value="wedding">Wedding</option>
            <option value="party">Party</option>
            <option value="workshop">Workshop</option>
          </select>
          <input
            type="text"
            placeholder="Location"
            className="w-full border p-3 rounded"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <input
            type="date"
            className="w-full border p-3 rounded"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price (optional)"
            className="w-full border p-3 rounded"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <input
            type="url"
            placeholder="Image URL (optional)"
            className="w-full border p-3 rounded"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-full w-full hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
          </button>
        </form>

        {/* Event List */}
        <div className="border rounded-lg">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-t">
                  <td className="p-3">{event.title}</td>
                  <td className="p-3">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="p-3">{event.location}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="text-red-600 hover:underline mr-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => fetchRegisteredUsers(event._id)}
                      className="text-green-600 hover:underline"
                    >
                      View Users
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* User Management */}
      {selectedEventId && (
        <section className="mb-10">
          <h3 className="text-2xl font-semibold mb-4">Registered Users for Event</h3>
          {isLoading ? (
            <p>Loading users...</p>
          ) : registeredUsers.length > 0 ? (
            <>
              <table className="w-full border rounded-lg table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {registeredUsers.map((user) => (
                    <tr key={user._id} className="border-t">
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => handleExportCSV(selectedEventId)}
                className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700"
              >
                Export as CSV
              </button>
            </>
          ) : (
            <p>No registered users for this event.</p>
          )}
        </section>
      )}

      {/* Message Management */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">Contact Messages</h3>
        <div className="border rounded-lg">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Message</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id} className="border-t">
                  <td className="p-3">{msg.name}</td>
                  <td className="p-3">{msg.email}</td>
                  <td className="p-3 truncate">{msg.message}</td>
                  <td className="p-3">{new Date(msg.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;