import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import Signup from '../Components/Signup';
import Navbar from '../Components/Navigation';
import Home from '../Components/Homepage';
import Events from '../Components/Event-listing';
import EventDetails from '../Components/Event-Details';
import Contact from '../Components/Contact';
import Login from '../Components/Login';
import AdminDashboard from '../AdminDashboard';
import AdminLogin from '../AdminLogin';
function App() {

  return (
       <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  )
}

export default App
