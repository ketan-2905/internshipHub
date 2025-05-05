import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../utils/axios';
import { toast } from 'react-toastify';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axiosClient.get('/api/bookmarks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setBookmarks(response.data);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        toast.error('Failed to load bookmarks');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const removeBookmark = async (internshipId) => {
    try {
      await axiosClient.post('/api/bookmarks/toggle', { internshipId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Update the bookmarks list
      setBookmarks(prevBookmarks => 
        prevBookmarks.filter(bookmark => bookmark.id !== internshipId)
      );
      
      toast.success('Bookmark removed successfully');
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast.error('Failed to remove bookmark');
    }
  };

  const [selectedInternship, setSelectedInternship] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openInternshipDetails = (internship) => {
    setSelectedInternship(internship);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInternship(null);
  };

  return (
    <div className="min-h-screen bg-dark-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Bookmarked Internships</h1>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="bg-dark-700 rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">{bookmark.role}</h2>
                      <p className="text-gray-400 text-sm">{bookmark.companyName}</p>
                    </div>
                    <button
                      onClick={() => removeBookmark(bookmark.id)}
                      className="text-primary-500 hover:text-primary-400 focus:outline-none"
                      aria-label="Remove bookmark"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {bookmark.location} ({bookmark.modeOfWork})
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ₹{bookmark.stipend}/month
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-red-400">Deadline:</span> {new Date(bookmark.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <span className="inline-block bg-primary-900 bg-opacity-50 text-primary-300 px-2 py-1 rounded text-xs font-medium">
                      {bookmark.duration} {bookmark.durationType}
                    </span>
                    <button
                    onClick={() => openInternshipDetails(bookmark)}
                    className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-700"
                  >
                    View Details
                  </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-dark-700 rounded-xl p-8 text-center shadow-card">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h2 className="text-xl font-medium text-white mb-2">No bookmarks yet</h2>
            <p className="text-gray-400 mb-6">You haven't bookmarked any internships yet.</p>
            <Link to="/internships" className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
              Browse Internships
            </Link>
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
                              } else if (diffDays <= 3) {
                                return <span className="flex items-center">{deadlineText} <span className="ml-2 bg-yellow-500 text-dark-800 text-xs px-2 py-0.5 rounded-full">{diffDays} day{diffDays === 1 ? '' : 's'} left</span></span>;
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

export default Bookmarks;