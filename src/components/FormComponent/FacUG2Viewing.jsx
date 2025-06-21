import React, { useEffect, useState } from "react";
import axios from "axios";

const FacUG2Viewing = ({ formId }) => {
  const [formData, setFormData] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState("pending");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        // Ensure this endpoint returns data structured for UG2, similar to UG1's backend
        // (i.e., with guideNames, employeeCodes, and processed file objects with .url)
        const response = await axios.post("/api/facapplication/view/ug2", { formId });
        const data = response.data;

        // UG2 specific data structure:
        // Assume data directly contains: title, description, utility, receivedFinance, financeDetails
        // guideNames, employeeCodes
        // students (array of {name, year, class, div, branch, rollNo, mobileNo})
        // expenses (array of {category, amount, details})
        // totalBudget
        // pdfFiles (array of {url, originalName, mimetype})
        // zipFileDetails ({url, originalName, mimetype})
        // guideSignature ({url, originalName, mimetype})
        // leaderSignature ({url, originalName, mimetype}) // Renamed from groupLeaderSignature for consistency with your UG2 frontend field
        // remarks, status

        setFormData(data);
        setRemarks(data.remarks || "");
        setStatus(data.status || "pending");
      } catch (error) {
        console.error("Error fetching UG2 form:", error);
      }
    };

    fetchForm();
  }, [formId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await axios.put(`/api/ug2form/faculty-review/${formId}`, { remarks, status });
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!formData) return <div className="p-4">Loading...</div>;

  return (
    <div className="form-container ug2-form">
      <h2>Under Graduate Form 2</h2>
      <p className="form-category">Faculty Review</p>

      <form onSubmit={handleSubmit}>
        <label>Title of Proposed Project:</label>
        <input value={formData.title} disabled />

        <label>Brief Description of Proposed Work:</label>
        <textarea value={formData.description} disabled />

        <label>Utility:</label>
        <input value={formData.utility} disabled />

        <fieldset>
          <legend>Received Finance from Other Agency?</legend>
          <label>
            <input type="radio" checked={formData.receivedFinance === true} disabled readOnly /> Yes
          </label>
          <label>
            <input type="radio" checked={formData.receivedFinance === false} disabled readOnly /> No
          </label>
        </fieldset>

        {formData.receivedFinance && (
          <div>
            <label>Details of Finance Received:</label>
            <textarea value={formData.financeDetails} disabled />
          </div>
        )}

        <h3>Guide/Co-Guide Details</h3>
        {(formData.guideNames || []).map((name, index) => (
          <div key={index}>
            <label>Name of Guide/Co-Guide {index + 1}:</label>
            <input value={name} disabled />
            <label>Employee Code {index + 1}:</label>
            <input value={formData.employeeCodes[index]} disabled />
          </div>
        ))}

        <h3>Student Details</h3>
        <table className="student-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Name</th>
              <th>Year</th>
              <th>Class</th>
              <th>Division</th>
              <th>Branch</th>
              <th>Roll No.</th>
              <th>Mobile No.</th>
            </tr>
          </thead>
          <tbody>
            {formData.students?.map((student, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td><input value={student.name} disabled /></td>
                <td><input value={student.year} disabled /></td>
                <td><input value={student.class} disabled /></td>
                <td><input value={student.div} disabled /></td>
                <td><input value={student.branch} disabled /></td>
                <td><input value={student.rollNo} disabled /></td>
                <td><input value={student.mobileNo} disabled /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Budget Details</h3>
        <table className="expense-table"> {/* Changed class from student-table to expense-table for distinct styling */}
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {formData.expenses?.map((exp, i) => (
              <tr key={i}>
                <td><input value={exp.category} disabled /></td>
                <td><input value={exp.amount} disabled /></td>
                <td><textarea value={exp.details} disabled /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <label>Total Budget:</label>
        <input value={formData.totalBudget} disabled />

        {/* Uploaded Files Section */}
        <div className="upload-section">
          <h3>Uploaded Files</h3>

          {/* PDF Files */}
          <div>
            <label>PDF Files:</label>
            {Array.isArray(formData.pdfFiles) && formData.pdfFiles.length > 0 ? (
              formData.pdfFiles.map((file, i) => (
                <div key={i}>
                  <a href={file.url} target="_blank" rel="noreferrer">
                    📄 {file.originalName || `PDF ${i + 1}`}
                  </a>
                </div>
              ))
            ) : (
              <p>No PDF files uploaded</p>
            )}
          </div>

          {/* ZIP File */}
          <div>
            <label>ZIP File:</label>
            {formData.zipFileDetails?.url ? (
              <a href={formData.zipFileDetails.url} target="_blank" rel="noreferrer">
                🗜️ {formData.zipFileDetails.originalName || "ZIP File"}
              </a>
            ) : (
              <p>No ZIP file uploaded</p>
            )}
          </div>

          {/* Guide Signature */}
          <div>
            <label>Guide Signature:</label>
            {formData.guideSignature?.url ? (
              <div className="signature-display"> {/* Add a class for signature display */}
                <a
                  href={formData.guideSignature.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  🖋️ {formData.guideSignature.originalName || "Guide Signature"}
                </a>
              </div>
            ) : (
              <p>Guide signature not uploaded</p>
            )}
          </div>

          {/* Group Leader Signature */}
          <div>
            <label>Group Leader Signature:</label>
            {formData.leaderSignature?.url ? ( // Note: Changed from groupLeaderSignature to leaderSignature for consistency
              <div className="signature-display">
                <a
                  href={formData.leaderSignature.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  🖋️ {formData.leaderSignature.originalName || "Group Leader Signature"}
                </a>
              </div>
            ) : (
              <p>Group leader signature not uploaded</p>
            )}
          </div>
        </div>

        {/* Remarks and Status */}
        <div>
          <label>Remarks:</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        <div>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default FacUG2Viewing;