import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import formMapper from "../components/FormComponent/FormMapper";

const ApplicationDetails = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/applications/getById", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id }),
        });
  
        if (!response.ok) throw new Error("Failed to fetch application");
        const data = await response.json();
        setApplication(data);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchApplication();
  }, [id]);

  if (!application) {
    return <div className="p-6">Loading application...</div>;
  }

  const FormComponent = formMapper[application.formType];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Application Details</h1>
      <div className="mb-4 text-gray-600">
        <p><strong>Topic:</strong> {application.topic}</p>
        <p><strong>Submitted on:</strong> {application.submitted}</p>
        <p><strong>Branch:</strong> {application.branch}</p>
        <p><strong>Form Type:</strong> {application.formType}</p>
      </div>

      {FormComponent ? (
        <FormComponent data={application.formData} viewOnly={true} />
      ) : (
        <p className="text-red-500">Unknown form type: {application.formType}</p>
      )}
    </div>
  );
};

export default ApplicationDetails;
