import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('email') === 'ketangaikwad035@gmail.com';
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    navigate('/login');
  };

  return (
    <nav className="bg-dark-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-primary-500 text-xl font-bold">InternshipHub</Link>
            </div>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn && (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/internships" className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                  Internships
                </Link>
                <Link to="/bookmarks" className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                  Bookmarks
                </Link>
                <Link to="/calendar" className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                  Calendar
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            )}
            {!isLoggedIn && (
              <>
                <Link to="/login" className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/signup" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-800">
            {isLoggedIn && (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium">
                  Dashboard
                </Link>
                <Link to="/internships" className="text-gray-300 hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium">
                  Internships
                </Link>
                <Link to="/bookmarks" className="text-gray-300 hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium">
                  Bookmarks
                </Link>
                <Link to="/calendar" className="text-gray-300 hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium">
                  Calendar
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-300 hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Logout
                </button>
              </>
            )}
            {!isLoggedIn && (
              <>
                <Link to="/login" className="text-gray-300 hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium">
                  Login
                </Link>
                <Link to="/signup" className="bg-primary-600 hover:bg-primary-700 text-white block px-3 py-2 rounded-md text-base font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;