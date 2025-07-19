import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../components/styles/dashboard.css"; // Ensure this CSS file contains styles for modal and status badges
import axios from 'axios'; // Import axios for API calls

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

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

  /**
   * Fetches applications based on the current user's role.
   * Consolidates them into a single list for display.
   */
  const fetchApplications = async (user) => {
    setLoading(true);
    setError(null);
    console.log(`Fetching applications for role: ${user?.role}`);

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      let fetchedData = [];

      if (!user) {
        throw new Error("User data not available. Please log in.");
      }

      const originalRole = user.role;
      const normalizedRole = originalRole ? String(originalRole).toLowerCase().trim().replace(/\s+/g, '_') : '';

      console.log("fetchApplications - Original Role from user object:", originalRole, "Normalized Role:", normalizedRole);

      const baseURL = "http://localhost:5000/api/facapplication";

      switch (normalizedRole) {
        case 'student':
          // Student: Use the new /all-by-svvnetid route
          if (user.svvNetId) {
            const studentRes = await axios.get(`${baseURL}/all-by-svvnetid?svvNetId=${user.svvNetId}`, { headers });
            fetchedData = studentRes.data;
          } else {
            throw new Error("Student SVVNetID not found.");
          }
          break;

        case 'faculty':
        case 'validator':
        case 'institute_coordinator':
        case 'admin':
        case 'principal':
          // For these roles, use the /applications-by-role endpoint.
          // The backend's `protect` middleware and `filterApplicationsByApprovalChain` will handle
          // the specific filtering based on the `req.user` object.
          const roleBasedRes = await axios.get(`${baseURL}/applications-by-role`, { headers });
          fetchedData = roleBasedRes.data;
          break;

        case 'department_coordinator': // Corrected case to match normalized role
        case 'hod':
          // For Department Coordinator and HOD, use the specific dashboard endpoint
          // which already filters by branch and applies approval chain logic.
          const deptCoordRes = await axios.get(`${baseURL}/form/deptCoordDashboard`, { headers });
          fetchedData = deptCoordRes.data;
          break;

        default:
          console.warn("Unknown user role in fetchApplications switch:", originalRole);
          setError("Unknown user role. Cannot fetch applications.");
          setLoading(false);
          return;
      }

      console.log("Applications fetched:", fetchedData);

      fetchedData.sort((a, b) => new Date(b.submitted) - new Date(a.submitted));
      setApplications(fetchedData);

    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(err.response?.data?.message || err.message); // Use err.message if no response data
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        let user = JSON.parse(storedUser);
        console.log("useEffect - Raw user object from localStorage:", user);

        const normalizedRoleFromStorage = user.role ? String(user.role).toLowerCase().trim().replace(/\s+/g, '_') : '';

        if ((normalizedRoleFromStorage === 'department_coordinator' || normalizedRoleFromStorage === 'hod') && !user.branch) { // Corrected normalized role check
            user = { ...user, branch: 'COMPS' }; // Assign a default branch if missing for these roles
            console.warn("User branch missing in localStorage for coordinator/HOD. Assigned default 'COMPS' for display.");
        }
        
        setCurrentUser(user);
        console.log("useEffect - currentUser set to:", user);
        fetchApplications(user);
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        setError("Error loading user data. Please log in again.");
        setLoading(false);
        navigate('/');
      }
    } else {
      console.log("No 'user' found in localStorage. Redirecting to login.");
      setLoading(false);
      navigate('/');
    }
  }, [navigate]);

  const handleViewClick = (id) => {
    navigate(`/status-tracking/${id}`);
  };

  // Dynamic content based on user role
  const getDashboardContent = (role) => {
    const originalRole = role;
    const normalizedRole = originalRole ? String(originalRole).toLowerCase().trim().replace(/\s+/g, '_') : '';

    console.log("getDashboardContent - Original Role:", originalRole, "Normalized Role:", normalizedRole);

    switch (normalizedRole) {
      case 'student':
        return {
          title: "Student Dashboard",
          description: "Here's an overview of all your submitted applications and their current statuses.",
        };
      case 'faculty':
        return {
          title: "Faculty Dashboard",
          description: "Overview of all applications relevant to you, including those awaiting your approval.",
        };
      case 'validator':
        return {
          title: "Validator Dashboard",
          description: "Overview of all applications awaiting validation or review.",
        };
      case 'department_coordinator': // Corrected case to match normalized role
      case 'hod': // Both HOD and Department Coordinator map to the same display logic
        return {
          // Conditionally include branch in title only if it exists
          title: currentUser?.branch ? `Department Coordinator Dashboard (${currentUser.branch})` : "Department Coordinator Dashboard",
          description: `Overview of applications for the ${currentUser?.branch || 'your'} department.`,
        };
      case 'institute_coordinator':
        return {
          title: "Institute Coordinator Dashboard",
          description: "Comprehensive overview of all applications across the institute.",
        };
      case 'admin':
        return {
          title: "Admin Dashboard",
          description: "Full administrative overview of all applications.",
        };
      case 'principal':
        return {
          title: "Principal Dashboard",
          description: "Overview of applications awaiting final approval across the institute.",
        };
      default:
        console.warn("Unknown or unhandled user role in getDashboardContent switch:", originalRole);
        return {
          title: "Dashboard",
          description: "Welcome to your application dashboard.",
        };
    }
  };

  // Calculate dashboard info only when currentUser is available
  const dashboardInfo = currentUser ? getDashboardContent(currentUser.role) : {
    title: "Loading Dashboard",
    description: "Please wait while we load your information."
  };

  // --- Calculate Dashboard Statistics ---
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status?.toLowerCase() === 'pending').length;
  const acceptedApplications = applications.filter(app => {
    const statusLower = app.status?.toLowerCase();
    return statusLower === 'accepted' || statusLower === 'approved';
  }).length;
  const rejectedApplications = applications.filter(app => app.status?.toLowerCase() === 'rejected').length;


  if (loading) {
    return (
      <div className="main-wrapper">
        <Navbar />
        <Sidebar />
        <div className="page-wrapper flex justify-center items-center min-h-screen">
          <div className="p-6 text-center text-lg text-gray-700">Loading your dashboard...</div>
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
    <div className="dashboard-container">
      <Navbar />
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-main">
          <h2 className="dashboard-title">{dashboardInfo.title}</h2>
          <p className="dashboard-description">
            {dashboardInfo.description}
          </p>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card total-apps">
              <div>
                <p className="stat-label">Total Applications</p>
                <p className="stat-value">{totalApplications}</p>
              </div>
              <div className="stat-icon">
                <i className="fa-solid fa-list-check"></i>
              </div>
            </div>

            <div className="stat-card pending-apps">
              <div>
                <p className="stat-label">Pending</p>
                <p className="stat-value">{pendingApplications}</p>
              </div>
              <div className="stat-icon">
                <i className="fa-solid fa-hourglass-half"></i>
              </div>
            </div>

            <div className="stat-card accepted-apps">
              <div>
                <p className="stat-label">Accepted</p>
                <p className="stat-value">{acceptedApplications}</p>
              </div>
              <div className="stat-icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
            </div>

            <div className="stat-card rejected-apps">
              <div>
                <p className="stat-label">Rejected</p>
                <p className="stat-value">{rejectedApplications}</p>
              </div>
              <div className="stat-icon">
                <i className="fa-solid fa-circle-xmark"></i>
              </div>
            </div>
          </div>

          <h3 className="table-title">Recent Applications</h3>

          <div className="applications-table-container">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Form Type</th>
                  <th>Name</th>
                  <th>Roll No.</th>
                  <th>Submitted On</th>
                  <th>Branch</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-applications">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app._id}>
                      <td>{app.formType || 'N/A'}</td>
                      <td>{app.name || 'N/A'}</td>
                      <td>
                        {app.rollNumber || app.rollNo || app.students?.[0]?.rollNo || app.studentDetails?.[0]?.rollNumber || "N/A"}
                      </td>
                      <td>
                        {new Date(app.submitted).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td>{getBranchForDisplay(app)}</td>
                      <td>
                        <span className={`status-badge ${app.status?.toLowerCase()}`}>
                          {app.status || 'N/A'}
                        </span>
                      </td>
                      <td>{app.remarks || 'No remarks provided.'}</td>
                      <td>
                        <button
                          onClick={() => handleViewClick(app._id)}
                          className="view-button"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;