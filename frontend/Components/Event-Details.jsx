import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching event.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!localStorage.getItem('token')) {
      setStatus('Please login to register.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    setIsLoading(true);
    setStatus('');
    try {
      await axios.post(
        'http://localhost:5000/api/registrations',
        { eventId: id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setStatus('Registered successfully!');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Error registering for event.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !event) return <div className="container mx-auto py-10 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto py-10 text-center text-red-600">{error}</div>;
  if (!event) return null;

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={event.imageUrl || 'https://via.placeholder.com/600'}
          alt={event.title}
          className="w-full md:w-1/2 h-96 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4">{event.title}</h2>
          <p className="text-gray-600 mb-2"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p className="text-gray-600 mb-2"><strong>Location:</strong> {event.location}</p>
          <p className="text-gray-600 mb-2"><strong>Price:</strong> {event.price ? `$${event.price}` : 'Free'}</p>
          <p className="text-gray-600 mb-4">{event.description}</p>
          <button
            onClick={handleRegister}
            disabled={isLoading}
            className={`bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Registering...' : 'Register Now'}
          </button>
          {status && (
            <p className={`mt-4 text-center ${status.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;