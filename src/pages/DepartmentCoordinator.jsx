import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../style.css";

const DeptCoordDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [currentAction, setCurrentAction] = useState(null);
  const [currentAppId, setCurrentAppId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [currentUser , setCurrentUser ] = useState(null);

  // Fetch applications
  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        navigate('/');
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.get("http://localhost:5000/api/facapplication/form/deptCoordDashboard", config);
      const allApps = response.data.map((app) => ({
        ...app,
        status: app.status,
        validatorId: app.validatorId || generateValidatorID(),
      }));
      setApplications(allApps);
    } catch (err) {
      setError("Failed to fetch applications. Please try again.");
      console.error("Error fetching applications:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser  = localStorage.getItem('user');
    if (storedUser ) {
      try {
        const user = JSON.parse(storedUser );
        setCurrentUser (user);
        fetchApplications();
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        setError("Error loading user data. Please log in again.");
        setLoading(false);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const getRollNumber = (app) => {
    return (
      app.rollNumber ||
      app.rollNo ||
      app.students?.[0]?.rollNo ||
      app.studentDetails?.[0]?.rollNumber ||
      "N/A"
    );
  };

  const handleViewClick = (id) => {
    navigate(`/application/${id}`);
  };

  const generateValidatorID = () => {
    const id = Math.floor(100 + Math.random() * 900);
    return `VA_${id}`;
  };

  const handleApproveClick = (appId) => {
    setCurrentAppId(appId);
    setCurrentAction("approve");
    setRemarks("");
    setModalError(null);
    setShowModal(true);
  };

  const handleRejectClick = (appId) => {
    setCurrentAppId(appId);
    setCurrentAction("reject");
    setRemarks("");
    setModalError(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setRemarks("");
    setCurrentAction(null);
    setCurrentAppId(null);
    setModalError(null);
  };

  const handleModalSubmit = async () => {
    if (!remarks.trim()) {
      setModalError("Remarks cannot be empty.");
      return;
    }

    setModalLoading(true);
    setModalError(null);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // ✅ Correct API endpoint
      const endpoint = `http://localhost:5000/api/facapplication/${currentAppId}/update-status`;

      const payload = {
        status: currentAction === "approve" ? "approved" : "rejected",
        remarks: remarks,
        changedBy: currentUser?.svvNetId || "Unknown",
        changedByRole: currentUser?.role || "department_coordinator"
      };

      console.log("📤 Submitting to:", endpoint);
      console.log("📦 Payload:", payload);

      await axios.patch(endpoint, payload, config);
      handleModalClose();
      fetchApplications(); // Refresh list after update
    } catch (err) {
      console.error("❌ Error updating application status:", err);
      setModalError(err.response?.data?.message || "Failed to submit remarks.");
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="main-wrapper">
        <Navbar />
        <Sidebar />
        <div className="page-wrapper flex justify-center items-center min-h-screen">
          <div className="p-6 text-center text-lg text-gray-700">Loading applications...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-wrapper">
        <Navbar />
        <Sidebar />
        <div className="page-wrapper flex justify-center items-center min-h-screen">
          <div className="p-6 text-center text-red-600 text-lg">Error: {error}. Please try again later.</div>
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                <p>Department Coordinator</p>
              </div>
            </div>

            <h2 className="dashboard-title">Recent Applications for Review</h2>
            <table className="app-table">
              <thead>
                <tr>
                  <th>Form</th>
                  <th>Applicant’s Roll No.</th>
                  <th>Application Date</th>
                  <th>Branch</th>
                  <th>Status</th>
                  <th>Validator ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications.map((app, index) => (
                    <tr key={index}>
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
                      <td>{app.branch || 'N/A'}</td>
                      <td className={`status ${app.status ? app.status.toLowerCase() : ''}`}>
                        {app.status || 'N/A'}
                      </td>
                      <td>{app.validatorId || 'N/A'}</td>
                      <td className="actions-column">
                        <button
                          className="view-btn"
                          onClick={() => handleViewClick(app._id)}
                        >
                          View Form
                        </button>
                        {(
                          currentUser?.role?.toLowerCase().includes("department") &&
                          !app.statusHistory?.some(h =>
                            h.changedByRole?.toLowerCase().replace(/\s+/g, '_') === 'department_coordinator'
                          )
                        ) && (
                          <>
                            <button
                              className="approve-btn"
                              onClick={() => handleApproveClick(app._id)}
                            >
                              Approve
                            </button>
                            <button
                              className="reject-btn"
                              onClick={() => handleRejectClick(app._id)}
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
                    <td colSpan="7">No Applications Found</td>
                  </tr>
                )}
              </tbody>
            </table>
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
                disabled={modalLoading}
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

export default DeptCoordDashboard;