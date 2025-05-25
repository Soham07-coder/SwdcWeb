import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PendingApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/applications/pending", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // if your backend uses cookies/auth
        });

        if (!response.ok) {
          throw new Error("Failed to fetch pending applications");
        }

        const data = await response.json();

        // The backend returns _id, so map it to id for frontend key usage
        const formattedData = data.map((app) => ({
          id: app._id,
          topic: app.topic,
          name: app.name,
          submitted: new Date(app.submitted).toLocaleDateString(),
          branch: app.branch,
        }));

        setApplications(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleViewClick = (id) => {
    navigate(`/application/${id}`);
  };

  if (loading) return <div className="p-6 max-w-4xl mx-auto">Loading...</div>;
  if (error)
    return (
      <div className="p-6 max-w-4xl mx-auto text-red-600">
        Error: {error}
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Pending Applications</h2>
      <p className="text-gray-600 mb-6">
        Easily track the details and statuses of all your submitted applications.
      </p>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Topic</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Submitted</th>
              <th className="p-3 border">Branch</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <tr key={app.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{app.topic}</td>
                  <td className="p-3">{app.name}</td>
                  <td className="p-3">{app.submitted}</td>
                  <td className="p-3">{app.branch}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleViewClick(app.id)}
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  No pending applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingApplications;
