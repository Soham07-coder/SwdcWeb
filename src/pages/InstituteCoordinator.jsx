import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios for API calls
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../style.css";

const InstCoordDash = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading status for main data fetch
  const [error, setError] = useState(null); // State to manage any errors during main data fetch
  const navigate = useNavigate();

  // --- NEW STATES FOR CUSTOM MODAL ---
  const [showModal, setShowModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [currentAction, setCurrentAction] = useState(null); // 'approve' or 'reject'
  const [currentAppId, setCurrentAppId] = useState(null); // Stores the _id of the application for modal action
  const [modalLoading, setModalLoading] = useState(false); // For submit button in modal
  const [modalError, setModalError] = useState(null);     // For displaying errors in modal
  const [currentUser, setCurrentUser] = useState(null); // State to store current user info

  /**
   * Helper function to get the branch from various possible locations in an application object.
   * This provides a more robust display on the frontend by prioritizing nested student branch.
   * @param {Object} app The application object.
   * @returns {string} The branch name or 'N/A' if not found.
   */
  const getBranchForDisplay = (app) => {
    return (
      app.students?.[0]?.branch || // Prioritize nested in students array
      app.studentDetails?.[0]?.branch || // Prioritize nested in studentDetails array
      app.branch || // Fallback to top-level 'branch' field
      app.department || // Fallback to 'department' field
      "N/A"
    );
  };

  // Function to fetch applications
  const fetchApplications = async () => {
    setLoading(true); // Set loading to true before fetching
    setError(null); // Clear any previous errors

    try {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');

      if (!token || !userString) {
        setError("Authentication token or user data not found. Please log in.");
        setLoading(false);
        navigate('/'); // Redirect to login page
        return;
      }

      const user = JSON.parse(userString);
      setCurrentUser(user); // Set current user for display purposes

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // Changed to axios.get as this is a data retrieval operation
      // Using the /applications-by-role endpoint which is filtered by backend's approval chain logic
      const response = await axios.get("http://localhost:5000/api/facapplication/applications-by-role", config); 
      
      // Assuming the backend returns an array of applications directly
      setApplications(response.data);
    } catch (err) {
      console.error("Error fetching applications for Institute Coordinator Dashboard:", err);
      // Check if err.response exists for more detailed error from backend
      setError(err.response?.data?.message || "Failed to load applications. Please try again later.");
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate('/'); // Redirect to login page on auth errors
      }
    } finally {
      setLoading(false); // Set loading to false after fetching (whether success or error)
    }
  };

  // useEffect hook to call fetchApplications when the component mounts
  useEffect(() => {
    fetchApplications();
  }, [navigate]); // Added navigate to dependency array as it's used inside fetchApplications

  // Handler for 'View' button click
  const handleViewClick = (id) => {
    navigate(`/application/${id}`); // Navigate to a specific application's detail page
  };

  // Handler for 'Approve' or 'Reject' button clicks
  const handleActionClick = (type, id) => {
    setCurrentAction(type);
    setCurrentAppId(id);
    setRemarks(""); // Clear remarks from previous use
    setModalError(null); // Clear previous modal errors
    setShowModal(true); // Open the modal
  };

  // Handles submitting remarks from the modal
  const handleModalSubmit = async () => {
    console.log("handleModalSubmit - currentUser at start:", currentUser); // Log currentUser before validation
    if (!remarks.trim()) {
      setModalError("Remarks are required.");
      return;
    }

    // Ensure currentUser is available before proceeding
    if (!currentUser || !currentUser.svvNetId || !currentUser.role) {
      setModalError("User authentication details are missing. Please log in again.");
      console.error("User details missing for status update:", currentUser);
      return;
    }

    setModalLoading(true);
    setModalError(null);

    const statusToSet = currentAction === "approve" ? "approved" : "rejected";
    const actionName = currentAction === "approve" ? "Approve" : "Reject";

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // API call to update the application status and remarks in the database
      await axios.patch(`http://localhost:5000/api/facapplication/${currentAppId}/update-status`, { // Changed to /status endpoint
        status: statusToSet,
        remarks: remarks.trim(),
        changedBy: currentUser.svvNetId, // Pass the SVVNetID of the current user
        changedByRole: currentUser.role // Pass the role of the current user
      }, config); // Pass config here

      // Refresh applications after successful update
      fetchApplications();
      handleModalClose(); // Close modal on success

    } catch (err) {
      console.error(`Error ${actionName} application:`, err);
      setModalError(`Failed to ${actionName} application: ${err.response?.data?.message || "Please try again."}`);
      // No need to call fetchApplications here again, it's called in finally
    } finally {
      setModalLoading(false);
    }
  };

  // Handler for closing the modal
  const handleModalClose = () => {
    setShowModal(false);
    setRemarks("");
    setCurrentAction(null);
    setCurrentAppId(null);
    setModalError(null); // Clear error on close
    setModalLoading(false); // Reset loading state
  };

  // Roll number extractor (unchanged)
  const getRollNumber = (app) => {
    return (
      app.rollNumber ||
      app.rollNo ||
      app.students?.[0]?.rollNo ||
      app.studentDetails?.[0]?.rollNumber ||
      "N/A"
    );
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="container">
          <Sidebar />
          <main className="content">
            <div className="dashboard-header">
              <div className="role-box">
                <strong>Signed in as</strong>
                <p>Institute Coordinator</p>
              </div>
            </div>

            <h2 className="dashboard-title">Applications Overview</h2>
            {loading && <p>Loading applications...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && (
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Sr.No</th>
                    <th>Form</th>
                    <th>Applicant’s Roll No.</th>
                    <th>Application Date</th>
                    <th>Branch</th> {/* Added Branch column */}
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length > 0 ? (
                    applications.map((app, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td> 
                        <td>{app.topic || 'N/A'}</td>
                        <td>{getRollNumber(app)}</td>
                        <td>{new Date(app.submitted).toLocaleString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                })}</td>
                        <td>{getBranchForDisplay(app)}</td> {/* Display Branch */}
                        <td className={`status ${app.status ? app.status.toLowerCase() : ''}`}>
                          {app.status || 'N/A'}
                        </td>
                        <td>
                          <button
                            className="view-button"
                            onClick={() => handleViewClick(app._id)}
                          >
                            View Form
                          </button>
                          {(
                            (app.status?.toLowerCase() === 'approved') &&
                            !app.statusHistory?.some(
                              h => h.changedByRole?.toLowerCase().replace(/\s+/g, '_')
                                === currentUser?.role?.toLowerCase().replace(/\s+/g, '_')
                            )
                          ) && (
                            <>
                              <button
                                className="approve-btn"
                                onClick={() => handleActionClick("approve", app._id)}
                              >
                                Approve
                              </button>
                              <button
                                className="reject-btn"
                                onClick={() => handleActionClick("reject", app._id)}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">No Applications Found</td> {/* Updated colspan */}
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </main>
        </div>
      </div>

       {/* --- CUSTOM REMARKS MODAL --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Enter Remarks for {currentAction === "approve" ? "Approval" : "Rejection"}</h3>
              <button className="modal-close" onClick={handleModalClose} disabled={modalLoading}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={`Enter remarks for ${currentAction === "approve" ? "approval" : "rejection"}...`}
                rows={6}
                disabled={modalLoading} // Disable while submitting
              />
              {modalError && <p className="modal-error-message">{modalError}</p>}
            </div>
            <div className="modal-footer">
              <button onClick={handleModalClose} className="modal-cancel" disabled={modalLoading}>
                Cancel
              </button>
              <button onClick={handleModalSubmit} className="modal-submit" disabled={modalLoading}>
                {modalLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstCoordDash;