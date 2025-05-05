import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axios';
import { toast } from 'react-toastify';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    collegeName: '',
    branch: '',
    division: '',
    sapId: '',
    dob: '',
    livingPlace: ''
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Sample college and branch options (can be fetched from API)
  const collegeOptions = ['Dwarkadas J. Sanghvi College of Engineering'];
  const branchOptions = [
    "Electronics and Telecommunication Engg",
    "Information Technology",
    "Computer Engineering",
    "Mechanical Engineering",
    "Computer Science and Engineering (Data Science)",
    "Artificial Intelligence and Machine Learning",
    "Artificial Intelligence (AI) and Data Science",
    "Computer Science and Engineering",
    "Computer Science and Engineering (IOT and Cyber Security with Block Chain Technology)"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === 'subdivision') {
      setFormData(prev => ({
        ...prev,
        [division]: prev[division]/value
      }));
    }else{
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosClient.post('/api/auth/signup', formData);
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-dark-800">
      <div className="max-w-2xl mx-auto bg-dark-700 p-8 rounded-xl shadow-card">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Create your account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-500 hover:text-primary-400">
              Sign in
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* College Name */}
            <div>
              <label htmlFor="collegeName" className="block text-sm font-medium text-gray-300">College Name</label>
              <select
                id="collegeName"
                name="collegeName"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.collegeName}
                onChange={handleChange}
              >
                <option style={{ backgroundColor: '#f3f4f6', color: '#111' }}value="">Select College</option>
                {collegeOptions.map((college, index) => (
                  <option key={index} value={college}>{college}</option>
                ))}
              </select>
            </div>

            {/* Branch */}
            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-gray-300">Branch</label>
              <select
                id="branch"
                name="branch"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.branch}
                onChange={handleChange}
              >
                <option value="">Select Branch</option>
                {branchOptions.map((branch, index) => (
                  <option key={index} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            {/* Division */}
            <div>
              <label htmlFor="division" className="block text-sm font-medium text-gray-300">Division</label>
              <input
                type="text"
                id="division"
                name="division"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.division}
                onChange={handleChange}
              />
            </div>

            {/* Subdivision */}
            <div>
              <label htmlFor="subdivision" className="block text-sm font-medium text-gray-300">Subdivision</label>
              <input
                type="text"
                id="subdivision"
                name="subdivision"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.subdivision}
                onChange={handleChange}
              />
            </div>

            {/* SAP ID */}
            <div>
              <label htmlFor="sapId" className="block text-sm font-medium text-gray-300">SAP ID</label>
              <input
                type="text"
                id="sapId"
                name="sapId"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.sapId}
                onChange={handleChange}
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-300">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            {/* Living Place */}
            <div className="sm:col-span-2">
              <label htmlFor="livingPlace" className="block text-sm font-medium text-gray-300">Living Place</label>
              <input
                type="text"
                id="livingPlace"
                name="livingPlace"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.livingPlace}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;