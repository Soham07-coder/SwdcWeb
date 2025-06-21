// src/pages/ApplicationDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import formMapper from "../components/FormComponent/FormMapper";

const ApplicationDetails = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      setError(null);

      try {
        let userBranch = null;
        let svvNetId = null; // Declare svvNetId variable

        const userString = localStorage.getItem("user");
        if (userString) {
          try {
            const user = JSON.parse(userString);
            userBranch = user.branch;
            svvNetId = user.svvNetId; // Get svvNetId from localStorage
          } catch (e) {
            console.error("Failed to parse user data from localStorage for ApplicationDetails:", e);
            // If user data is corrupted, clear local storage and force re-login
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setError("User session corrupted. Please log in again.");
            setLoading(false);
            // Optionally, navigate to login page
            // navigate('/login');
            return;
          }
        }

        // Essential: If svvNetId is not available, the user is not authenticated for this action.
        if (!svvNetId) {
          setError("User not authenticated. Please log in to view application details.");
          setLoading(false);
          // Optionally, navigate to login page
          // navigate('/login');
          return;
        }

        // Construct the URL with both userBranch and svvNetId as query parameters
        const baseUrl = `http://localhost:5000/api/application/${id}`;
        const params = new URLSearchParams();

        if (userBranch) {
          params.append('userBranch', userBranch);
        }
        params.append('svvNetId', svvNetId); // Always send svvNetId for authentication/authorization

        const url = `${baseUrl}?${params.toString()}`;

        const res = await fetch(url);
        if (!res.ok) {
          const text = await res.text();
          let errorMessage = `Failed to fetch application details (status ${res.status}): ${text}`;

          // Provide more user-friendly messages for common errors
          if (res.status === 404) {
            errorMessage = "Application not found or you don't have permission to access it.";
          } else if (res.status === 400 && text.includes("svvNetId is required")) {
            errorMessage = "Authentication error: svvNetId missing. Please log in.";
          }
          throw new Error(errorMessage);
        }
        const data = await res.json();
        setApplication(data); // full form data directly
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if an ID is present in the URL
    if (id) fetchApplication();
  }, [id, navigate]); // Add 'navigate' to dependency array as it's used if uncommented

  if (loading) return <div className="p-6">Loading application details...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!application) return <div className="p-6">No application found.</div>;

  // Ensure FormComponent is defined before rendering
  const FormComponent = formMapper[application.formType];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Application Details</h1>
      <div className="mb-4 text-gray-600 space-y-1">
        {/* Use application.topic as the primary display, falling back to projectTitle if topic is undefined */}
        <p><strong>Topic:</strong> {
        application.topic && application.topic !== "Untitled Project"
          ? application.topic
          : application.projectTitle ||
            application.titleOfSTTP || // Add more fallbacks
            application.formTitle || // If you use this field
            application.title || // generic fallback
            'N/A'
        }</p>
        {/* Use application.name as the primary display, falling back to other possible fields if name is undefined */}
        <p><strong>Applicant Name:</strong> {application.name || 'N/A'}</p>
        <p><strong>Submitted on:</strong> {new Date(application.submitted).toLocaleDateString()}</p>
        {/* The branch field will now come from the backend's processed data,
            which prioritizes the user's branch from localStorage */}
        <p><strong>Branch:</strong> {application.branch || 'N/A'}</p>
        <p><strong>Form Type:</strong> {application.formType || 'N/A'}</p>
        <p><strong>Status:</strong> {application.status || 'N/A'}</p>
      </div>

      {FormComponent ? (
        <FormComponent data={application} viewOnly={true} />
      ) : (
        <p className="text-red-500">Unknown form type: {application.formType}</p>
      )}
    </div>
  );
};
export default ApplicationDetails;