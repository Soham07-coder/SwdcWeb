import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FacUG1Viewing = ({ formId }) => {
  const [formData, setFormData] = useState(null);
  const [status, setStatus] = useState('pending');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.post(`/api/facapplication/view/ug1`, { formId });
        const data = response.data;

        // Normalize fields to match the form structure
        setFormData({
          projectTitle: data.projectTitle || '',
          projectUtility: data.projectUtility || '',
          projectDescription: data.projectDescription || '',
          finance: data.finance || 'No',
          guideNames: (data.guides || []).map(g => g.guideName),
          employeeCodes: (data.guides || []).map(g => g.employeeCode),
          studentDetails: data.students || [],
          pdfFiles: data.pdfFiles || [],
          zipFile: data.zipFileDetails || null,
          groupLeaderSignature: data.groupLeaderSignature || null,
          guideSignature: data.guideSignature || null,
        });

        setStatus(data.status || 'pending');
        setRemarks(data.remarks || '');
      } catch (error) {
        console.error('Error fetching UG1 form:', error);
      }
    };

    fetchForm();
  }, [formId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await axios.put(`/api/ug1form/${formId}/faculty-review`, { status, remarks });
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!formData) return <div className="p-4">Loading...</div>;

  return (
    <div className="form-container ug1-form">
      <h2>Under Graduate Form 1</h2>
      <p className="form-category">In-house Student Project within Department</p>

      <form onSubmit={handleSubmit}>
        <label>Title of the Project:</label>
        <input value={formData.projectTitle} disabled />

        <label>Utility of the Project:</label>
        <input value={formData.projectUtility} disabled />

        <label>Description:</label>
        <textarea value={formData.projectDescription} disabled />

        <fieldset>
          <legend>Whether received finance from any other agency:</legend>
          <label>
            <input type="radio" checked={formData.finance === "Yes"} readOnly disabled /> Yes
          </label>
          <label>
            <input type="radio" checked={formData.finance === "No"} readOnly disabled /> No
          </label>
        </fieldset>

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
              <th>Branch</th>
              <th>Year</th>
              <th>Name</th>
              <th>Roll No</th>
            </tr>
          </thead>
          <tbody>
            {(formData.studentDetails || []).map((student, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td><input value={student.branch} disabled /></td>
                <td><input value={student.yearOfStudy} disabled /></td>
                <td><input value={student.studentName} disabled /></td>
                <td><input value={student.rollNumber} disabled /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Uploaded Files</h3>
        <div>
        <label>PDF Files:</label>
        {(formData.pdfFiles || []).length > 0 ? (
            formData.pdfFiles.map((file, i) => (
            <div key={i}>
                <a href={file.url} target="_blank" rel="noreferrer">
                📄 {file.originalName || `PDF ${i + 1}`}
                </a>
            </div>
            ))
        ) : (
            <p>No PDFs uploaded</p>
        )}
        </div>

        <div>
          <label>ZIP File:</label>
          {formData.zipFile ? (
            <a href={formData.zipFile.url} target="_blank" rel="noreferrer">
            🗜️ {formData.zipFile.originalName}
            </a>
          ) : <p>No ZIP uploaded</p>}
        </div>

        <div>
          <label>Group Leader Signature:</label>
          {formData.groupLeaderSignature ? (
            <a href={formData.groupLeaderSignature.url} target="_blank" rel="noreferrer">
            🖋️ {formData.groupLeaderSignature.originalName}
            </a>
          ) : <p>Not uploaded</p>}
        </div>

        <div>
          <label>Guide Signature:</label>
          {formData.guideSignature ? (
            <a href={formData.guideSignature.url} target="_blank" rel="noreferrer">
            🖋️ {formData.guideSignature.originalName}
            </a>
          ) : <p>Not uploaded</p>}
        </div>

        <div>
          <label>Remarks:</label>
          <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </div>

        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="approved">Approve</option>
            <option value="rejected">Reject</option>
          </select>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default FacUG1Viewing;
