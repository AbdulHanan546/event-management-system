import React from "react";
function Navbar  ()  {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">EventSphere</Link>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-gray-200">Home</Link>
          <Link to="/events" className="text-white hover:text-gray-200">Events</Link>
          <Link to="/contact" className="text-white hover:text-gray-200">Contact</Link>
          {isLoggedIn ? (
            <Link to="/profile" className="text-white hover:text-gray-200">Profile</Link>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-gray-200">Login</Link>
              <Link to="/signup" className="text-white hover:text-gray-200">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
