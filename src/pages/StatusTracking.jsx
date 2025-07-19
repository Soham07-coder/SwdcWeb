import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../components/styles/StatusTracking.css";

const StatusTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/facapplication/status-tracking/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            navigate('/');
            return;
          }
          throw new Error(`HTTP error! Status: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setApplication(data);
      } catch (err) {
        console.error("Error fetching application details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplicationDetails();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="status-tracking-wrapper">
        <Navbar />
        <Sidebar />
        <div className="status-loading">
          <div className="p-6 text-center">Loading application details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-tracking-wrapper">
        <Navbar />
        <Sidebar />
        <div className="status-error">
          <div className="p-6 text-center">Error: {error}. Please try again later.</div>
          <button
            onClick={() => navigate('/')}
            className="status-error-button"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="status-tracking-wrapper">
        <Navbar />
        <Sidebar />
        <div className="status-loading">
          <div className="p-6 text-center">Application not found.</div>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="status-tracking-wrapper">
      <Navbar />
      <Sidebar />
      <div className="status-tracking-content">
        <h2 className="page-title">Application Details & Status Tracking</h2>

        <div className="status-app-info">
          <h3>Application Information</h3>
          <div className="status-info-grid">
            <p className="status-info-item"><strong>Form Type:</strong> {application.formType || 'N/A'}</p>
            <p className="status-info-item"><strong>Name:</strong> {application.name || 'N/A'}</p>
            <p className="status-info-item"><strong>Roll No.:</strong> {application.rollNumber || application.rollNo || application.students?.[0]?.rollNo || application.studentDetails?.[0]?.rollNumber || "N/A"}</p>
            <p className="status-info-item"><strong>Branch:</strong> {application.branch || 'N/A'}</p>
            <p className="status-info-item"><strong>Submitted On:</strong> {formatDateTime(application.createdAt || application.submitted)}</p>
            <p className="status-info-item"><strong>Current Status:</strong> <span className={`status-badge status-${application.status?.toLowerCase()}`}>{application.status || 'N/A'}</span></p>
            <p className="status-info-item md:col-span-2"><strong>Remarks:</strong> {application.remarks || 'No remarks provided.'}</p>
            {application.documents && application.documents.length > 0 && (
              <div className="status-info-item md:col-span-2">
                <h4>Attached Documents:</h4>
                <ul className="documents-list">
                  {application.documents.map((doc, index) => (
                    <li key={index}>
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="document-link">
                        {doc.filename}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="status-timeline">
          <h3>Application Status History</h3>
          {application.statusHistory && application.statusHistory.length > 0 ? (
            <div className="timeline-container">
              {application.statusHistory
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                .map((history, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <p className="timeline-date">{formatDateTime(history.timestamp)}</p>
                      <h4 className="timeline-status">{history.status.replace(/_/g, ' ')}</h4>
                      <p className="timeline-details">{history.details || 'No details provided.'}</p>
                      {history.changedBy && (
                        <p className="timeline-changedby">
                          By: {history.changedBy} ({history.changedByRole || 'N/A'})
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-600">No detailed status history available for this application.</p>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate(-1)}
            className="status-back-button"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusTracking;