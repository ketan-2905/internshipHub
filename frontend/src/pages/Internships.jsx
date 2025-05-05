import { useState, useEffect } from 'react';
import axiosClient from '../utils/axios';
import { toast } from 'react-toastify';

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    role: '',
    mode: '',
    deadline: '',
    requirements: ''
  });
  
  // Unique filter options
  const [filterOptions, setFilterOptions] = useState({
    roles: [],
    modes: [],
    requirements: []
  });
  
  // Toggle filter panel visibility
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        // Fetch internships and bookmarked IDs in parallel
        const [internshipsResponse, bookmarksResponse] = await Promise.all([
          axiosClient.get('/api/internships', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axiosClient.get('/api/bookmarks/ids', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);
  
        // Add isBookmarked flag to each internship
        const internshipsWithBookmarkStatus = internshipsResponse.data.map(internship => ({
          ...internship,
          isBookmarked: bookmarksResponse.data.includes(internship._id)
        }));
  
        setInternships(internshipsWithBookmarkStatus);
        setFilteredInternships(internshipsWithBookmarkStatus);
        
        // Extract unique filter options
        const roles = [...new Set(internshipsWithBookmarkStatus.map(item => item.role))];
        const modes = [...new Set(internshipsWithBookmarkStatus.map(item => item.mode || item.modeOfWork))];
        
        // Create a flattened array of all requirements
        const allRequirements = internshipsWithBookmarkStatus
          .flatMap(item => (item.requirements || '').split(',').map(req => req.trim()))
          .filter(Boolean);
        
        // Get unique requirements
        const uniqueRequirements = [...new Set(allRequirements)];
        
        setFilterOptions({
          roles,
          modes,
          requirements: uniqueRequirements
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchInternships();
  }, []);

  // Apply filters whenever filters state changes
  useEffect(() => {
    if (internships.length === 0) return;
    
    const applyFilters = () => {
      let result = [...internships];
      
      // Filter by role
      if (filters.role) {
        result = result.filter(item => item.role === filters.role);
      }
      
      // Filter by mode
      if (filters.mode) {
        result = result.filter(item => (item.mode || item.modeOfWork) === filters.mode);
      }
      
      // Filter by deadline
      if (filters.deadline) {
        const today = new Date();
        const oneWeekLater = new Date();
        oneWeekLater.setDate(today.getDate() + 7);
        
        switch (filters.deadline) {
          case 'closing-soon':
            // Deadlines within the next 3 days
            const threeDaysLater = new Date();
            threeDaysLater.setDate(today.getDate() + 4);
            result = result.filter(item => {
              const deadline = new Date(item.deadline);
              return deadline >= today && deadline <= threeDaysLater;
            });
            break;
          case 'this-week':
            // Deadlines within the next 7 days
            result = result.filter(item => {
              const deadline = new Date(item.deadline);
              return deadline >= today && deadline <= oneWeekLater;
            });
            break;
          case 'upcoming':
            // Deadlines more than a week away
            result = result.filter(item => {
              const deadline = new Date(item.deadline);
              return deadline > oneWeekLater;
            });
            break;
          default:
            break;
        }
      }
      
      // Filter by requirements
      if (filters.requirements) {
        result = result.filter(item => 
          (item.requirements || '').toLowerCase().includes(filters.requirements.toLowerCase())
        );
      }
      
      setFilteredInternships(result);
    };
    
    applyFilters();
  }, [filters, internships]);

  const toggleBookmark = async (internshipId) => {
    try {
      const response = await axiosClient.post('/api/bookmarks/toggle', { internshipId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      const [internshipsResponse, bookmarksResponse] = await Promise.all([
        axiosClient.get('/api/internships', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axiosClient.get('/api/bookmarks/ids', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      // Add isBookmarked flag to each internship
      const internshipsWithBookmarkStatus = internshipsResponse.data.map(internship => ({
        ...internship,
        isBookmarked: bookmarksResponse.data.includes(internship._id)
      }));

      setInternships(internshipsWithBookmarkStatus);
      // Re-apply existing filters to updated data
      const updatedFiltered = internshipsWithBookmarkStatus.filter(internship => {
        let matches = true;
        
        if (filters.role && internship.role !== filters.role) matches = false;
        if (filters.mode && (internship.mode || internship.modeOfWork) !== filters.mode) matches = false;
        if (filters.requirements && !(internship.requirements || '').toLowerCase().includes(filters.requirements.toLowerCase())) matches = false;
        
        // Apply deadline filter if set
        if (filters.deadline && matches) {
          const deadline = new Date(internship.deadline);
          const today = new Date();
          const oneWeekLater = new Date();
          oneWeekLater.setDate(today.getDate() + 7);
          
          if (filters.deadline === 'closing-soon') {
            const threeDaysLater = new Date();
            threeDaysLater.setDate(today.getDate() + 3);
            if (!(deadline >= today && deadline <= threeDaysLater)) matches = false;
          } else if (filters.deadline === 'this-week') {
            if (!(deadline >= today && deadline <= oneWeekLater)) matches = false;
          } else if (filters.deadline === 'upcoming') {
            if (!(deadline > oneWeekLater)) matches = false;
          }
        }
        
        return matches;
      });
      
      setFilteredInternships(updatedFiltered);
      
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  };

  const openInternshipDetails = (internship) => {
    setSelectedInternship(internship);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInternship(null);
  };
  
  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      role: '',
      mode: '',
      deadline: '',
      requirements: ''
    });
  };

  return (
    <div className="min-h-screen bg-dark-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Available Internships</h1>
          
          <div className="flex items-center">
            <button 
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className="flex items-center px-4 py-2 bg-dark-700 hover:bg-dark-600 text-gray-200 rounded-md mr-3 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
              <span className="ml-2 bg-primary-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {Object.values(filters).filter(Boolean).length}
              </span>
            </button>
            
            {Object.values(filters).some(Boolean) && (
              <button 
                onClick={resetFilters}
                className="px-4 py-2 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-md transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        
        {/* Filter Panel */}
        {isFilterPanelOpen && (
          <div className="bg-dark-700 rounded-xl p-5 mb-6 shadow-lg transition-all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Role Filter */}
              <div>
                <label htmlFor="role-filter" className="block text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <select
                  id="role-filter"
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="w-full bg-dark-800 border border-dark-500 rounded-md py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Roles</option>
                  {filterOptions.roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              
              {/* Mode Filter */}
              <div>
                <label htmlFor="mode-filter" className="block text-sm font-medium text-gray-300 mb-2">
                  Work Mode
                </label>
                <select
                  id="mode-filter"
                  value={filters.mode}
                  onChange={(e) => handleFilterChange('mode', e.target.value)}
                  className="w-full bg-dark-800 border border-dark-500 rounded-md py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Modes</option>
                  {filterOptions.modes.map((mode) => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>
              
              {/* Deadline Filter */}
              <div>
                <label htmlFor="deadline-filter" className="block text-sm font-medium text-gray-300 mb-2">
                  Deadline
                </label>
                <select
                  id="deadline-filter"
                  value={filters.deadline}
                  onChange={(e) => handleFilterChange('deadline', e.target.value)}
                  className="w-full bg-dark-800 border border-dark-500 rounded-md py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Deadlines</option>
                  <option value="closing-soon">Closing Soon (3 days)</option>
                  <option value="this-week">This Week</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
              
              {/* Requirements Filter */}
              <div>
                <label htmlFor="requirements-filter" className="block text-sm font-medium text-gray-300 mb-2">
                  Skills Required
                </label>
                <input
                  type="text"
                  id="requirements-filter"
                  value={filters.requirements}
                  onChange={(e) => handleFilterChange('requirements', e.target.value)}
                  placeholder="Search skills..."
                  className="w-full bg-dark-800 border border-dark-500 rounded-md py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            {/* Popular skills quick select */}
            {filterOptions.requirements.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-400 mb-2">Popular Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.requirements.slice(0, 8).map((skill) => (
                    <button
                      key={skill}
                      onClick={() => handleFilterChange('requirements', skill)}
                      className={`text-xs px-3 py-1 rounded-full ${
                        filters.requirements === skill 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Results summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-400">
            Showing {filteredInternships.length} {filteredInternships.length === 1 ? 'result' : 'results'}
            {Object.values(filters).some(Boolean) && ' with applied filters'}
          </p>
          
          {filteredInternships.length === 0 && Object.values(filters).some(Boolean) && (
            <button 
              onClick={resetFilters}
              className="text-primary-400 hover:underline text-sm font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredInternships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((internship) => (
              <div 
  key={internship._id} 
  className={`rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-shadow ${
    (() => {
      const today = new Date();
      const deadline = new Date(internship.deadline);
      const diffTime = deadline - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      



      if (diffDays === 2) {
        return 'bg-red-900 bg-opacity-30'; // 1 day left - light red
      } else if (diffDays === 3) {
        return 'bg-yellow-900 bg-opacity-30'; // 2 days left - light yellow
      } else if (diffDays === 4) {
        return 'bg-green-900 bg-opacity-30'; // 3 days left - light green
      }
      return 'bg-dark-700'; // Default background
    })()
  }`}
>
  <div className="p-6">
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">{internship.role}</h2>
        <p className="text-gray-400 text-sm">{internship.companyName}</p>
      </div>
      <button
        onClick={() => toggleBookmark(internship._id)}
        className="text-gray-400 hover:text-primary-400 focus:outline-none"
        aria-label={internship.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        {internship.isBookmarked ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        )}
      </button>
    </div>
    
    <div className="mt-4 space-y-2">
      <div className="flex items-center text-sm text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {internship.mode || internship.modeOfWork}
      </div>
      
      <div className="flex items-center text-sm text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {internship.stipend}
      </div>
      
      <div className="flex items-center text-sm text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {(() => {
          const today = new Date();
          const deadline = new Date(internship.deadline);
          const diffTime = deadline - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          let deadlineText = `Deadline: ${new Date(internship.deadline).toLocaleDateString()}`;
          
          if (diffDays <= 0) {
            deadlineText += " (Expired)";
          } else if (diffDays <= 3) {
            deadlineText += ` (${diffDays} day${diffDays === 1 ? '' : 's'} left)`;
          }
          
          return deadlineText;
        })()}
      </div>
    </div>
    
    {/* Skills chips */}
    {internship.requirements && (
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {internship.requirements.split(',').map((req, idx) => (
            <span 
              key={idx} 
              className="bg-dark-600 text-gray-300 text-xs px-2 py-1 rounded-full"
            >
              {req.trim()}
            </span>
          ))}
        </div>
      </div>
    )}
    
    <button
      onClick={() => openInternshipDetails(internship)}
      className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-700"
    >
      View Details
    </button>
  </div>
</div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-dark-700 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-white">No internships available</h3>
            <p className="mt-2 text-gray-400">
              {Object.values(filters).some(Boolean) 
                ? "No internships match your current filters. Try adjusting your criteria."
                : "Check back later for new opportunities."}
            </p>
          </div>
        )}
      </div>

      {/* Internship Details Modal */}
      {isModalOpen && selectedInternship && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-black/40 -z-10 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl leading-6 font-bold text-white" id="modal-title">
                        {selectedInternship.role}
                      </h3>
                      <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-white focus:outline-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-lg text-primary-400 font-medium">{selectedInternship.companyName}</p>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-dark-600 p-3 rounded-lg">
                          <p className="text-sm text-gray-400">Mode of Work</p>
                          <p className="text-white font-medium">{selectedInternship.mode || selectedInternship.modeOfWork}</p>
                        </div>
                        
                        <div className="bg-dark-600 p-3 rounded-lg">
                          <p className="text-sm text-gray-400">Stipend</p>
                          <p className="text-white font-medium">{selectedInternship.stipend}</p>
                        </div>
                        
                        {selectedInternship.startDate && (
                          <div className="bg-dark-600 p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Start Date</p>
                            <p className="text-white font-medium">{new Date(selectedInternship.startDate).toLocaleDateString()}</p>
                          </div>
                        )}
                        
                        <div className="bg-dark-600 p-3 rounded-lg">
                          <p className="text-sm text-gray-400">Application Deadline</p>
                          <p className="text-white font-medium">
                            {(() => {
                              const today = new Date();
                              const deadline = new Date(selectedInternship.deadline);
                              const diffTime = deadline - today;
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                              
                              let deadlineText = `${new Date(selectedInternship.deadline).toLocaleDateString()}`;
                              
                              if (diffDays <= 0) {
                                return <span className="flex items-center">{deadlineText} <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Expired</span></span>;
                              } else if ((diffDays-1) <= 1) {
                                return <span className="flex items-center">{deadlineText} <span className="ml-2 bg-yellow-500 text-dark-800 text-xs px-2 py-0.5 rounded-full">{diffDays-1} day{diffDays === 1 ? '' : ''} left</span></span>;
                              }else if ((diffDays-1) <= 2) {
                                return <span className="flex items-center">{deadlineText} <span className="ml-2 bg-yellow-500 text-dark-800 text-xs px-2 py-0.5 rounded-full">{diffDays-1} day{diffDays === 1 ? '' : 's'} left</span></span>;
                              }
                              
                              return deadlineText;
                            })()}
                          </p>
                        </div>
                      </div>
                      
                      {selectedInternship.description && (
                        <div className="mt-6">
                          <h4 className="text-lg font-medium text-white mb-2">Description</h4>
                          <p className="text-gray-300">{selectedInternship.description}</p>
                        </div>
                      )}
                      
                      <div className="mt-6">
                        <h4 className="text-lg font-medium text-white mb-2">Requirements</h4>
                        <ul className="list-disc pl-5 text-gray-300 space-y-1">
                          {(selectedInternship.requirements || '').split(",").map((req, index) => (
                            <li key={index}>{req.trim()}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {selectedInternship.documentLink && (
                        <div className="mt-6">
                          <h4 className="text-lg font-medium text-white mb-2">Documents</h4>
                          <a 
                            href={selectedInternship.documentLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary-400 hover:text-primary-300"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View Document
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-dark-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedInternship.formLink && (
                  <a
                    href={selectedInternship.formLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Apply Now
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => toggleBookmark(selectedInternship._id)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-dark-700 text-base font-medium text-gray-300 hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {selectedInternship.isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Internships;