import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(9); // 9 events per page
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:5000/api/events', {
          params: { page, limit, category, dateFrom, dateTo, q: searchQuery },
        });
        setEvents(response.data.events || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching events.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [page, category, dateFrom, dateTo, searchQuery]);

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Upcoming Events</h2>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search events..."
          className="border p-2 rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="conference">Conference</option>
          <option value="wedding">Wedding</option>
          <option value="party">Party</option>
          <option value="workshop">Workshop</option>
        </select>
        <input
          type="date"
          className="border p-2 rounded"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          placeholder="From Date"
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          placeholder="To Date"
        />
      </div>
      {/* Error Message */}
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {/* Loading State */}
      {isLoading && <p className="text-center">Loading events...</p>}
      {/* Event Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.length > 0 && !isLoading ? (
          events.map((event) => (
            <Link
              to={`/events/${event._id}`}
              key={event._id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg"
            >
              <img
                src={event.imageUrl || 'https://via.placeholder.com/300'}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                <p className="text-gray-600">{event.location}</p>
                <p className="text-gray-500 truncate">{event.description}</p>
              </div>
            </Link>
          ))
        ) : (
          !isLoading && <p className="text-center col-span-3">No events found.</p>
        )}
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Events;