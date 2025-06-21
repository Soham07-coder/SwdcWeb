// src/pages/FacPendingApplications.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FacPendingApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:5000/api/facapplication/pending?all=true`);
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error("Error fetching faculty pending applications:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleViewClick = (id) => {
    navigate(`/application/${id}`);
  };

  if (loading) return <div className="p-6">Loading pending applications...</div>;
  if (error)
    return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Pending Applications for Approval</h2>
      <p className="text-gray-600 mb-6">
        Review and take action on submitted student applications that require your approval.
      </p>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Form Type</th>
              <th className="p-3 border">Project Title</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Roll No.</th>
              <th className="p-3 border">Submitted</th>
              <th className="p-3 border">Branch</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-4">
                  No pending applications found.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium text-blue-600">{app.formType || "N/A"}</td>
                  <td className="p-3">{app.topic || "N/A"}</td>
                  <td className="p-3">{app.name || "N/A"}</td>
                  <td className="p-3">
                    {app.rollNumber ||
                      app.rollNo ||
                      app.students?.[0]?.rollNo ||
                      app.studentDetails?.[0]?.rollNumber ||
                      "N/A"}
                  </td>
                  <td className="p-3">
                    {new Date(app.submitted).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-3">{app.branch || "N/A"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleViewClick(app._id)}
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacPendingApplications;
