import { useState, useEffect } from "react";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";

const Admin = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const [activeTab, setActiveTab] = useState("internships");
  const [internships, setInternships] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    companyName: "",
    location: "",
    modeOfWork: "Remote",
    stipend: "",
    duration: "",
    durationType: "Months",
    deadline: "",
    description: "",
    requirements: "",
    responsibilities: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "internships") {
          const response = await axiosClient.get("/api/internships", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setInternships(response.data);
        } else {
          const response = await axiosClient.get("/api/users", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setUsers(response.data);
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
        toast.error(`Failed to load ${activeTab}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/api/internships", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Internship added successfully");
      setShowAddModal(false);

      // Refresh internships list
      const response = await axiosClient.get("/api/internships", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setInternships(response.data);

      // Reset form
      setFormData({
        role: "",
        companyName: "",
        location: "",
        modeOfWork: "Remote",
        stipend: "",
        duration: "",
        durationType: "Months",
        deadline: "",
        description: "",
        requirements: "",
        responsibilities: "",
      });
    } catch (error) {
      console.error("Error adding internship:", error);
      toast.error("Failed to add internship");
    }
  };

  const deleteInternship = async (id) => {
    if (window.confirm("Are you sure you want to delete this internship?")) {
      try {
        await axiosClient.delete(`/api/internships/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Internship deleted successfully");

        // Update the list
        setInternships((prev) =>
          prev.filter((internship) => internship.id !== id)
        );
      } catch (error) {
        console.error("Error deleting internship:", error);
        toast.error("Failed to delete internship");
      }
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", selectedFile);  // Make sure this matches the field name expected by multer ('file')
  
    try {
      const response = await axiosClient.post("/api/upload/excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      const data = response.data;
      
      if (response.status === 201) {  // The server returns 201 on success
        setUploadStatus(`Success: ${data.message}`);
        // optionally refresh data here
      } else {
        setUploadStatus(data.message || "Upload failed.");
      }
    } catch (err) {
      setUploadStatus(
        err.response?.data?.message || 
        "Error uploading file. Please check the file format and try again."
      );
      console.error(err);
    }
  };
  

  return (
    <div className="min-h-screen bg-dark-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          {activeTab === "internships" && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Add New Internship
              </button>

              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Upload Excel
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "internships"
                ? "text-primary-500 border-b-2 border-primary-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("internships")}
          >
            Manage Internships
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "users"
                ? "text-primary-500 border-b-2 border-primary-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("users")}
          >
            Manage Users
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : activeTab === "internships" ? (
          <div className="bg-dark-700 rounded-xl overflow-hidden shadow-card">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-dark-600">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Internship
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Details
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Deadline
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-dark-700 divide-y divide-gray-700">
                {internships.length > 0 ? (
                  internships.map((internship) => (
                    <tr key={internship.id} className="hover:bg-dark-600">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {internship.role}
                        </div>
                        <div className="text-sm text-gray-400">
                          {internship.companyName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {internship.location}
                        </div>
                        <div className="text-sm text-gray-400">
                          ₹{internship.stipend}/month
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {new Date(internship.deadline).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-400 hover:text-primary-300 mr-3">
                          Edit
                        </button>
                        <button
                          className="text-red-500 hover:text-red-400"
                          onClick={() => deleteInternship(internship.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-400"
                    >
                      No internships found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-dark-700 rounded-xl overflow-hidden shadow-card">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-dark-600">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    College
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-dark-700 divide-y divide-gray-700">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-dark-600">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-gray-400">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {user.collegeName}
                        </div>
                        <div className="text-sm text-gray-400">
                          {user.branch}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-400 hover:text-primary-300 mr-3">
                          View
                        </button>
                        <button className="text-red-500 hover:text-red-400">
                          Disable
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-400"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Internship Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Add New Internship
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={formData.role}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="modeOfWork"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Mode of Work
                  </label>
                  <select
                    id="modeOfWork"
                    name="modeOfWork"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={formData.modeOfWork}
                    onChange={handleChange}
                  >
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="stipend"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Stipend (₹)
                  </label>
                  <input
                    type="number"
                    id="stipend"
                    name="stipend"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={formData.stipend}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label
                      htmlFor="duration"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Duration
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={formData.duration}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="durationType"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Type
                    </label>
                    <select
                      id="durationType"
                      name="durationType"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={formData.durationType}
                      onChange={handleChange}
                    >
                      <option value="Months">Months</option>
                      <option value="Weeks">Weeks</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="deadline"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="requirements"
                  className="block text-sm font-medium text-gray-300"
                >
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  rows="3"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Enter each requirement on a new line"
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="responsibilities"
                  className="block text-sm font-medium text-gray-300"
                >
                  Responsibilities
                </label>
                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  rows="3"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-dark-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  placeholder="Enter each responsibility on a new line"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md text-sm font-medium hover:bg-dark-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700"
                >
                  Add Internship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showUploadModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50">
          <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Upload Excel File
            </h2>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="mb-4 block w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {uploadStatus && (
              <p className="text-sm text-center text-gray-200 mb-2">
                {uploadStatus}
              </p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setUploadStatus("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                onClick={handleFileUpload}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
