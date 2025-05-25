import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/UG1.css";

const UG1Form = () => {
  const [formData, setFormData] = useState({
    projectTitle: "",
    projectUtility: "",
    projectDescription: "",
    finance: "",
    guideName: "",
    employeeCode: "",
    svvNetId: "",
    studentDetails: Array(4).fill({
      branch: "",
      yearOfStudy: "",
      studentName: "",
      rollNumber: "",
    }),
  });

  const [pdfFiles, setPdfFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [formId, setFormId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const svvNetIdRef = useRef("");
  const [groupLeaderSignature, setGroupLeaderSignature] = useState(null);
  const [guideSignature, setGuideSignature] = useState(null);

  useEffect(() => {
    const storedSvvNetId = localStorage.getItem("svvNetId");
    if (storedSvvNetId) {
      svvNetIdRef.current = storedSvvNetId;
    }
  }, []);

  // Handle text input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle student details input change
  const handleStudentDetailsChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedStudents = [...prev.studentDetails];
      updatedStudents[index] = { ...updatedStudents[index], [field]: value };
      return { ...prev, studentDetails: updatedStudents };
    });
  };

  // Handle Finance Option Selection
  const handleRadioChange = (value) => {
    setFormData((prev) => ({ ...prev, finance: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const existingFileNames = new Set(pdfFiles.map((file) => file.name)); // Prevent duplicates

    files.forEach((file) => {
      if (file.type !== "application/pdf") {
        alert("❌ Only PDF files are allowed.");
      } else if (file.size > 5 * 1024 * 1024) {
        alert("❌ File must be less than 5MB.");
      } else if (existingFileNames.has(file.name)) {
        alert("❌ File already selected.");
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length) {
      setPdfFiles((prev) => [...prev, ...validFiles]);
    }

    // Reset file input to allow uploading same file again if removed
    e.target.value = null;
  };

  // Remove a selected file
  const removeFile = (index) => {
    setPdfFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Signature Upload
  const handleSignatureUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "image/jpeg") {
      alert("❌ Only JPEG images are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("❌ File must be less than 2MB.");
      return;
    }

    if (type === "groupLeader") {
      setGroupLeaderSignature(file);
    } else if (type === "guide") {
      setGuideSignature(file);
    }
  };

  // Upload Signature to Backend
  const uploadSignature = async (file, type, id) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/ug1form/uploadSignature/${id}/${type}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(`✅ ${type} Signature Uploaded:`, response.data);
    } catch (error) {
      console.error(`❌ Error uploading ${type} signature:`, error);
      throw error;
    }
  };

  // Upload all PDFs sequentially
  const handleUploadPDFs = async (formId) => {
    try {
      for (const file of pdfFiles) {
        const formData = new FormData();
        formData.append("pdfFile", file);

        await axios.post(`http://localhost:5000/api/ug1form/uploadPdf/${formId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log(`PDF ${file.name} uploaded successfully!`);
      }
    } catch (error) {
      console.error("PDF Upload error:", error);
      throw error;
    }
  };

  // Save Form Data
  const handleSaveFormData = async () => {
    setErrorMessage("");

    // Basic validation for required fields
    if (
      !formData.projectTitle.trim() ||
      !formData.projectUtility.trim() ||
      !formData.projectDescription.trim() ||
      !formData.guideName.trim()
    ) {
      setErrorMessage("Please fill all required fields.");
      return null;
    }

    try {
      const dataToSend = { ...formData, svvNetId: svvNetIdRef.current };
      const response = await axios.post("http://localhost:5000/api/ug1form/saveFormData", dataToSend);

      console.log("✅ Form Data Saved:", response.data);

      if (response.data.formId) {
        setFormId(response.data.formId);
        alert("✅ Form data saved successfully!");
        return response.data.formId;
      } else {
        setErrorMessage("Failed to get form ID. Try again.");
        return null;
      }
    } catch (error) {
      console.error("❌ Error Saving Form Data:", error);
      setErrorMessage("Error saving form data. Try again.");
      return null;
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submit

    setIsSubmitting(true);
    try {
      const savedFormId = await handleSaveFormData();

      if (!savedFormId) {
        setIsSubmitting(false);
        return;
      }

      // Upload PDFs if any
      if (pdfFiles.length > 0) {
        await handleUploadPDFs(savedFormId);
      }

      // Upload signatures if present
      if (groupLeaderSignature) {
        await uploadSignature(groupLeaderSignature, "groupLeader", savedFormId);
      }
      if (guideSignature) {
        await uploadSignature(guideSignature, "guide", savedFormId);
      }

      alert("✅ Form submitted successfully!");

      // Optionally reset form here if you want
      // resetForm();

    } catch (error) {
      setErrorMessage("An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="form-container">
      <h2>Under Graduate Form 1</h2>
      <p className="form-category">In-house Student Project within Department</p>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <label>Title of the Project:</label>
        <input
          type="text"
          value={formData.projectTitle}
          onChange={(e) => handleInputChange("projectTitle", e.target.value)}
          required
        />

        <label>Utility of the Project:</label>
        <input
          type="text"
          value={formData.projectUtility}
          onChange={(e) => handleInputChange("projectUtility", e.target.value)}
          required
        />

        <label>Description:</label>
        <textarea
          value={formData.projectDescription}
          onChange={(e) => handleInputChange("projectDescription", e.target.value)}
          required
        />

        <label>Whether received finance from any other agency:</label>
        <div className="form-group">
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="finance"
                value="Yes"
                checked={formData.finance === "Yes"}
                onChange={() => handleRadioChange("Yes")}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="finance"
                value="No"
                checked={formData.finance === "No"}
                onChange={() => handleRadioChange("No")}
              />
              No
            </label>
          </div>
        </div>

        <div className="guide-details">
          <div>
            <label>Name of the Guide/Co-Guide:</label>
            <input
              type="text"
              value={formData.guideName}
              onChange={(e) => handleInputChange("guideName", e.target.value)}
              required
            />
          </div>
          <div>
            <label>Employee Code:</label>
            <input
              type="text"
              value={formData.employeeCode}
              onChange={(e) => handleInputChange("employeeCode", e.target.value)}
            />
          </div>
        </div>

        {/* Student Details Table */}
        <h3>Student Details</h3>
        <table className="student-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Branch</th>
              <th>Year of Study</th>
              <th>Student Name</th>
              <th>Roll Number</th>
            </tr>
          </thead>
          <tbody>
            {formData.studentDetails.map((student, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="text"
                    value={student.branch}
                    onChange={(e) => handleStudentDetailsChange(index, "branch", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={student.yearOfStudy}
                    onChange={(e) => handleStudentDetailsChange(index, "yearOfStudy", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={student.studentName}
                    onChange={(e) => handleStudentDetailsChange(index, "studentName", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={student.rollNumber}
                    onChange={(e) => handleStudentDetailsChange(index, "rollNumber", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="signatures">
          <div>
            <label>Signature of Group Leader (JPEG Only)</label>
            <input
              type="file"
              accept="image/jpeg"
              name="groupLeaderSignature"
              onChange={(e) => handleSignatureUpload(e, "groupLeader")}
            />
            {groupLeaderSignature && <p className="file-name">{groupLeaderSignature.name}</p>}
          </div>

          <div>
            <label>Signature of Guide (JPEG Only)</label>
            <input
              type="file"
              accept="image/jpeg"
              name="guideSignature"
              onChange={(e) => handleSignatureUpload(e, "guide")}
            />
            {guideSignature && <p className="file-name">{guideSignature.name}</p>}
          </div>
        </div>

        <div className="form-group">
          <label>Upload Supporting Documents (PDF):</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf"
            multiple
          />
          <ul className="file-list">
            {pdfFiles.map((file, index) => (
              <li key={index}>
                {file.name}{" "}
                <button type="button" onClick={() => removeFile(index)}>
                  ❌ Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="form-actions">
          <button type="button" className="back-btn" onClick={handleBack} disabled={isSubmitting}>
            Back
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UG1Form;
