import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../style.css";
import axios from "axios"; // Import axios

const HodDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [currentUser, setCurrentUser] = useState(null); // State to store current user info
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate();

   useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors before a new fetch

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

        // Include the token in the request headers
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        // Fetch applications using the /applications-by-role endpoint
        // The backend will filter based on the HOD's role and approval chain logic
        // CHANGED: From axios.post to axios.get to match backend route definition
        const response = await axios.get("http://localhost:5000/api/facapplication/form/hodDashboard", config);

        // Process the data received from the backend
        const allApps = response.data.map((app) => ({
          ...app,
          status: app.status,
          validatorId: app.validatorId || 'N/A', // Assuming validatorId is set by backend or N/A
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

    fetchApplications();
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

  const getBranchForDisplay = (app) => {
    return (
      app.students?.[0]?.branch || // Prioritize nested in students array
      app.studentDetails?.[0]?.branch || // Prioritize nested in studentDetails array
      app.branch || // Fallback to top-level 'branch' field
      app.department || // Fallback to 'department' field
      "N/A"
    );
  };

  const handleViewClick = (id) => {
    navigate(`/application/${id}`); // Navigate to a specific application's detail page
  };
  /**
   * Generates a unique Validator ID in the format VA_XXX.
   * @returns {string} The generated Validator ID.
   */
  const generateValidatorID = () => {
    const id = Math.floor(100 + Math.random() * 900); // Generates a random 3-digit number
    return `VA_${id}`;
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
                <p>HOD</p>
              </div>
            </div>

            <h2 className="dashboard-title">Recents</h2>
            {/* Conditional rendering based on loading and error states */}
            {loading && <p>Loading applications...</p>}
            {error && <p className="error-message">{error}</p>}
            {/* Render table only when not loading and no error */}
            {!loading && !error && (
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Form</th>
                    <th>Applicant’s Roll No.</th>
                    <th>Application Date</th>
                    <th>Branch</th> {/* Added Branch Header */}
                    <th>Status</th>
                    <th>Validator ID</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length > 0 ? (
                    applications.map((app, index) => (
                      <tr key={index}>
                        <td>{app.topic || 'N/A'}</td> {/* Add fallback for display */}
                        <td>{getRollNumber(app)}</td>
                        <td>{new Date(app.submitted).toLocaleString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true // Use AM/PM format
                                })}</td>
                        <td>{getBranchForDisplay(app)}</td> {/* Added Branch Data */}
                        {/* Ensure app.status is a string for className, or provide fallback */}
                        <td className={`status ${app.status ? app.status.toLowerCase() : ''}`}>
                          {app.status || 'N/A'}
                        </td>
                        <td>{app.validatorId || 'N/A'}</td>
                        <td>
                          <button
                            className="view-btn"
                            onClick={() => handleViewClick(app._id)}
                          >
                            View Form
                          </button>
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
    </>
  );
};

export default HodDashboard;