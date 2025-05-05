import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [stats, setStats] = useState({
    bookmarked: 0,
    applied: 0,
    selected: 0,
  });
  const [recentInternships, setRecentInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem("name") || "User";

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user stats
        const statsResponse = await axiosClient.get("/api/user/stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setStats(statsResponse.data);

        // Fetch recent internships
        const internshipsResponse = await axiosClient.get(
          "/api/internships/recent",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRecentInternships(internshipsResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-dark-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-700 rounded-xl p-8 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-primary-100">
            Track your internship applications and discover new opportunities.
          </p>
          <Link
            to="/calendar"
            className="mt-4 inline-block bg-white text-primary-700 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            View Calendar
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-700 rounded-xl p-6 shadow-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-900 bg-opacity-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-300">
                  Bookmarked
                </h2>
                <p className="text-2xl font-bold text-white">
                  {loading ? "..." : stats.bookmarked}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-dark-700 rounded-xl p-6 shadow-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-900 bg-opacity-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-300">Applied</h2>
                <p className="text-2xl font-bold text-white">
                  {loading ? "..." : stats.applied}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-dark-700 rounded-xl p-6 shadow-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-900 bg-opacity-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-300">Selected</h2>
                <p className="text-2xl font-bold text-white">
                  {loading ? "..." : stats.selected}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Internships Section */}
        <div className="bg-dark-700 rounded-xl p-6 shadow-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Internships</h2>
            <Link
              to="/internships"
              className="text-primary-400 hover:text-primary-300 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : recentInternships.length > 0 ? (
            // <div className="space-y-4">
            //   {recentInternships.map((internship) => (
            //     <div key={internship.id} className="bg-dark-600 rounded-lg p-4 hover:bg-dark-500 transition-colors">
            //       <div className="flex justify-between">
            //         <div>
            //           <h3 className="text-lg font-medium text-white">{internship.role}</h3>
            //           <p className="text-gray-400">{internship.companyName}</p>
            //         </div>
            //         <div className="text-right">
            //           <span className="inline-block bg-primary-900 bg-opacity-50 text-primary-300 px-2 py-1 rounded text-xs font-medium">
            //             {internship.modeOfWork}
            //           </span>
            //           <p className="text-gray-400 mt-1">₹{internship.stipend}/month</p>
            //         </div>
            //       </div>
            //       <div className="mt-2 flex justify-between items-center">
            //         <p className="text-sm text-gray-400">
            //           <span className="text-red-400">Deadline:</span> {new Date(internship.deadline).toLocaleDateString()}
            //         </p>
            //         <a
            //           onClick={() => openInternshipDetails(internship)}
            //           className="text-primary-500 hover:text-primary-400 text-sm font-medium cursor-pointer"
            //         >
            //           View Details
            //         </a>
            //       </div>
            //     </div>
            //   ))}
            // </div>
            <div className="space-y-4">
              {recentInternships.map((internship) => {
                const deadlineDate = new Date(internship.deadline);
                const today = new Date();
                const oneDayAfter = new Date(today);
                oneDayAfter.setDate(today.getDate() + 1);

                const isDeadlineTomorrow =
                  deadlineDate.getDate() === oneDayAfter.getDate() &&
                  deadlineDate.getMonth() === oneDayAfter.getMonth() &&
                  deadlineDate.getFullYear() === oneDayAfter.getFullYear();

                return (
                  <div
                    key={internship.id}
                    className={`rounded-lg p-4 hover:bg-dark-500 transition-colors ${
                      isDeadlineTomorrow
                        ? "bg-red-900 bg-opacity-30 border border-red-500"
                        : "bg-dark-600"
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium text-white">
                            {internship.role}
                          </h3>
                          {isDeadlineTomorrow && (
                            <img
                              src="/hurry.png" // Replace with your actual image path
                              alt="Hurry! Deadline tomorrow"
                              className="h-6 w-6 animate-pulse"
                              title="Deadline is tomorrow!"
                            />
                          )}
                        </div>
                        <p className="text-gray-400">
                          {internship.companyName}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-primary-900 bg-opacity-50 text-primary-300 px-2 py-1 rounded text-xs font-medium">
                          {internship.mode}
                        </span>
                        <p className="text-gray-400 mt-1">
                        {internship.stipend.includes("/") ? `₹${internship.stipend}` : `${internship.stipend}`}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <p
                        className={`text-sm ${
                          isDeadlineTomorrow
                            ? "text-red-300 font-bold"
                            : "text-gray-400"
                        }`}
                      >
                        <span className="text-red-400">Deadline:</span>{" "}
                        {deadlineDate.toLocaleDateString()}
                        {isDeadlineTomorrow && (
                          <span className="ml-2">
                            ⏰ Hurry! Deadline tomorrow!
                          </span>
                        )}
                      </p>
                      <a
                        onClick={() => openInternshipDetails(internship)}
                        className="text-primary-500 hover:text-primary-400 text-sm font-medium cursor-pointer"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">
                No internships available at the moment.
              </p>
              <Link
                to="/internships"
                className="mt-2 inline-block text-primary-500 hover:text-primary-400"
              >
                Browse all internships
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Internship Details Modal */}
      {isModalOpen && selectedInternship && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-black/40 -z-10 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={closeModal}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                      <h3
                        className="text-2xl leading-6 font-bold text-white"
                        id="modal-title"
                      >
                        {selectedInternship.role}
                      </h3>
                      <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-white focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-2">
                      <p className="text-lg text-primary-400 font-medium">
                        {selectedInternship.companyName}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-dark-600 p-3 rounded-lg">
                          <p className="text-sm text-gray-400">Mode of Work</p>
                          <p className="text-white font-medium">
                            {selectedInternship.mode ||
                              selectedInternship.modeOfWork}
                          </p>
                        </div>

                        <div className="bg-dark-600 p-3 rounded-lg">
                          <p className="text-sm text-gray-400">Stipend</p>
                          <p className="text-white font-medium">
                            {selectedInternship.stipend}
                          </p>
                        </div>

                        {selectedInternship.startDate && (
                          <div className="bg-dark-600 p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Start Date</p>
                            <p className="text-white font-medium">
                              {new Date(
                                selectedInternship.startDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        <div className="bg-dark-600 p-3 rounded-lg">
                          <p className="text-sm text-gray-400">
                            Application Deadline
                          </p>
                          <p className="text-white font-medium">
                            {(() => {
                              const today = new Date();
                              const deadline = new Date(
                                selectedInternship.deadline
                              );
                              const diffTime = deadline - today;
                              const diffDays = Math.ceil(
                                diffTime / (1000 * 60 * 60 * 24)
                              );

                              let deadlineText = `${new Date(
                                selectedInternship.deadline
                              ).toLocaleDateString()}`;

                              if (diffDays <= 0) {
                                return (
                                  <span className="flex items-center">
                                    {deadlineText}{" "}
                                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                      Expired
                                    </span>
                                  </span>
                                );
                              } else if (diffDays <= 3) {
                                return (
                                  <span className="flex items-center">
                                    {deadlineText}{" "}
                                    <span className="ml-2 bg-yellow-500 text-dark-800 text-xs px-2 py-0.5 rounded-full">
                                      {diffDays} day{diffDays === 1 ? "" : "s"}{" "}
                                      left
                                    </span>
                                  </span>
                                );
                              }

                              return deadlineText;
                            })()}
                          </p>
                        </div>
                      </div>

                      {selectedInternship.description && (
                        <div className="mt-6">
                          <h4 className="text-lg font-medium text-white mb-2">
                            Description
                          </h4>
                          <p className="text-gray-300">
                            {selectedInternship.description}
                          </p>
                        </div>
                      )}

                      <div className="mt-6">
                        <h4 className="text-lg font-medium text-white mb-2">
                          Requirements
                        </h4>
                        <ul className="list-disc pl-5 text-gray-300 space-y-1">
                          {(selectedInternship.requirements || "")
                            .split(",")
                            .map((req, index) => (
                              <li key={index}>{req.trim()}</li>
                            ))}
                        </ul>
                      </div>

                      {selectedInternship.documentLink && (
                        <div className="mt-6">
                          <h4 className="text-lg font-medium text-white mb-2">
                            Documents
                          </h4>
                          <a
                            href={selectedInternship.documentLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary-400 hover:text-primary-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
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
                  {selectedInternship.isBookmarked
                    ? "Remove Bookmark"
                    : "Bookmark"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
