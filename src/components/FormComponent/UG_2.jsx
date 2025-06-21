import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UG2.css";

const UGForm2 = ({ viewOnly = false, data = null }) => {
  const initialState = {
    projectTitle: "",
    projectDescription: "",
    utility: "",
    receivedFinance: false,
    financeDetails: "",
    guideDetails: [{ name: "", employeeCode: "" }],
    students: [],
    expenses: [],
    totalBudget: "",
    groupLeaderSignature: null,
    guideSignature: null,
    uploadedFiles: [],
    status: "pending",
    errorMessage: "",
    errors: {},
  };

  const getInitialFormData = () => {
    if (viewOnly && data) {
      return {
        ...initialState,
        projectTitle: data.projectTitle || "",
        projectDescription: data.projectDescription || "",
        utility: data.utility || "",
        receivedFinance: data.receivedFinance || false,
        financeDetails: data.financeDetails || "",
        guideDetails:
          Array.isArray(data.guideDetails) && data.guideDetails.length > 0
            ? data.guideDetails
            : [{ name: "", employeeCode: "" }],
        students: data.students || [],
        expenses: data.expenses || [],
        totalBudget: data.totalBudget || "",
        groupLeaderSignature: data.groupLeaderSignature || null,
        guideSignature: data.guideSignature || null,
        uploadedFiles: data.uploadedFiles || [],
        status: data.status || "pending",
      };
    } else {
      return initialState;
    }
  };

  const [formData, setFormData] = useState(getInitialFormData);

  useEffect(() => {
    if (viewOnly && data) {
      setFormData(getInitialFormData());
    }
  }, [data, viewOnly]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userMessage, setUserMessage] = useState(null);
  const handleBack = () => {
    window.history.back();
  };

  const validateForm = () => {
    const errors = {};

    if (!(formData.projectTitle || "").trim())
      errors.projectTitle = "Project title is required.";
    if (!(formData.projectDescription || "").trim())
      errors.projectDescription = "Project description is required.";
    if (!(formData.utility || "").trim())
      errors.utility = "Utility is required.";

    if (formData.receivedFinance && !(formData.financeDetails || "").trim()) {
      errors.financeDetails = "Finance details are required if finance received.";
    }
    if (!formData.guideDetails || formData.guideDetails.length === 0) {
      errors.guideDetails = "At least one guide is required.";
    } else {
      formData.guideDetails.forEach((guide, idx) => {
        if (!(guide.name || "").trim())
          errors[`guideName_${idx}`] = "Guide name is required.";
        if (!(guide.employeeCode || "").trim())
          errors[`guideEmployeeCode_${idx}`] = "Guide employee code is required.";
      });
    }

    if (!formData.students || formData.students.length === 0) {
      errors.students = "At least one student is required.";
    } else {
      formData.students.forEach((student, idx) => {
        if (!(student.name || "").trim())
          errors[`studentName_${idx}`] = "Student name is required.";
        if (!(student.year || "").trim())
          errors[`studentYear_${idx}`] = "Year is required.";
        if (!(student.class || "").trim())
          errors[`studentClass_${idx}`] = "Class is required.";
        if (!(student.div || "").trim())
          errors[`studentDiv_${idx}`] = "Div is required.";
        if (!(student.branch || "").trim())
          errors[`studentBranch_${idx}`] = "Branch is required.";
        if (!(student.rollNo || "").trim())
          errors[`studentRollNo_${idx}`] = "Roll No. is required.";

        const mobile = (student.mobileNo || "").trim();
        if (!mobile) {
          errors[`studentMobileNo_${idx}`] = "Mobile No. is required.";
        } else if (!/^\d{10}$/.test(mobile)) {
          errors[`studentMobileNo_${idx}`] = "Mobile No. must be 10 digits.";
        }
      });
    }

    (formData.expenses || []).forEach((expense, idx) => {
      if (!(expense.category || "").trim())
        errors[`expenseCategory_${idx}`] = "Category is required.";
      const amount = (expense.amount || "").toString().trim();
      if (!amount) {
        errors[`expenseAmount_${idx}`] = "Amount is required.";
      } else if (isNaN(amount) || Number(amount) <= 0) {
        errors[`expenseAmount_${idx}`] = "Amount must be a positive number.";
      }
    });

    const totalBudget = (formData.totalBudget || "").toString().trim();
    if (!totalBudget) {
      errors.totalBudget = "Total budget is required.";
    } else if (isNaN(totalBudget) || Number(totalBudget) <= 0) {
      errors.totalBudget = "Total budget must be a positive number.";
    }

    if (!viewOnly) {
      const isValidSignature = (sig) => {
        if (!sig) return false;
        if (sig instanceof File) {
          return sig.type === "image/jpeg" && sig.size <= 5 * 1024 * 1024;
        }
        return sig.url || sig.name;
      };

      if (!isValidSignature(formData.groupLeaderSignature)) {
        errors.groupLeaderSignature = "Group leader signature must be a JPEG under 5MB.";
      }

      if (!isValidSignature(formData.guideSignature)) {
        errors.guideSignature = "Guide signature must be a JPEG under 5MB.";
      }

      const files = formData.uploadedFiles || [];
      if (files.length === 0) {
        errors.uploadedFiles = "At least one additional document is required.";
      } else if (files.length <= 5) {
        files.forEach((file, idx) => {
          if (file instanceof File) {
            if (!file.type || file.type !== "application/pdf") {
              errors[`uploadedFile_${idx}`] = `File "${file.name}" must be a PDF.`;
            }
            if (!file.size || file.size > 5 * 1024 * 1024) {
              errors[`uploadedFile_${idx}`] = `File "${file.name}" must be under 5MB.`;
            }
          }
        });
      } else {
        if (files.length !== 1) {
          errors.uploadedFiles = "If more than 5 files, upload exactly one ZIP archive.";
        } else {
          const file = files[0];
          const isZip = file.type.includes("zip") || file.name?.endsWith(".zip");
          const isUnder25MB = file.size <= 25 * 1024 * 1024;
          if (!isZip) {
            errors.uploadedFiles = "The file must be a ZIP archive.";
          } else if (!isUnder25MB) {
            errors.uploadedFiles = "ZIP file must be under 25MB.";
          }
        }
      }
    }

    setFormData((prev) => ({ ...prev, errors }));
    if (Object.keys(errors).length > 0) {
      console.error("❌ Validation errors:", errors);
    }
    return Object.keys(errors).length === 0;
  };

  const removeUploadedFile = (index) => {
    const updated = [...formData.uploadedFiles];
    updated.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      uploadedFiles: updated,
    }));
  };

  const updateGuideField = (e, index, field) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updatedGuides = [...prev.guideDetails];
      updatedGuides[index] = { ...updatedGuides[index], [field]: value };

      return {
        ...prev,
        guideDetails: updatedGuides,
        errors: {
          ...prev.errors,
          [`guide${field === "name" ? "Name" : "EmployeeCode"}_${index}`]: "", // clear error
        }
      };
    });
  };

  const addGuideRow = () => {
    setFormData((prev) => ({
      ...prev,
      guideDetails: [...prev.guideDetails, { name: "", employeeCode: "" }],
    }));
  };

  const removeGuideRow = (index) => {
    setFormData((prev) => {
      const updatedGuides = [...prev.guideDetails];
      updatedGuides.splice(index, 1);

      const updatedErrors = { ...prev.errors };
      delete updatedErrors[`guideName_${index}`];
      delete updatedErrors[`guideEmployeeCode_${index}`];

      return {
        ...prev,
        guideDetails: updatedGuides,
        errors: updatedErrors,
      };
    });
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
      errors: { ...formData.errors, [name]: null },
    });
  };

  const updateStudentField = (e, index, field) => {
    const updatedStudents = [...formData.students];
    updatedStudents[index][field] = e.target.value;
    setFormData({ ...formData, students: updatedStudents });
  };

  const removeStudentRow = (index) => {
    const updatedStudents = [...formData.students];
    updatedStudents.splice(index, 1);
    setFormData({ ...formData, students: updatedStudents });
  };

  const updateExpenseField = (e, index, field) => {
    const updatedExpenses = [...formData.expenses];
    const value = e.target.value;

    // If updating amount, store it as raw string but validate later
    updatedExpenses[index][field] = field === "amount" ? value.replace(/[^0-9.]/g, "") : value.trim();

    setFormData(prev => ({
      ...prev,
      expenses: updatedExpenses,
    }));
  };

  const removeExpenseRow = (index) => {
    const updatedExpenses = [...formData.expenses];
    updatedExpenses.splice(index, 1);
    setFormData({ ...formData, expenses: updatedExpenses });
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const currentFiles = [...formData.uploadedFiles];

    let pdfCount = currentFiles.filter(file =>
      file.type === "application/pdf" || file.name?.toLowerCase().endsWith(".pdf")
    ).length;

    const zipExists = currentFiles.some(file =>
      file.type === "application/zip" || file.name?.toLowerCase().endsWith(".zip")
    );

    const newFiles = [];
    let error = "";

    for (const file of selectedFiles) {
      const isPdf = file.type === "application/pdf" || file.name?.toLowerCase().endsWith(".pdf");
      const isZip = file.type === "application/zip" || file.name?.toLowerCase().endsWith(".zip");

      if (!isPdf && !isZip) {
        error = "Only PDF and ZIP files are allowed.";
        break;
      }

      if (isPdf) {
        if (pdfCount >= 5) {
          error = "Maximum of 5 PDF files allowed.";
          break;
        }
        if (file.size > 5 * 1024 * 1024) {
          error = `PDF "${file.name}" exceeds 5MB.`;
          break;
        }
        pdfCount++;
        newFiles.push(file);
      }

      if (isZip) {
        const newZipAlready = newFiles.some(
          f => f.type === "application/zip" || f.name?.toLowerCase().endsWith(".zip")
        );
        if (zipExists || newZipAlready) {
          error = "Only one ZIP file is allowed.";
          break;
        }
        if (file.size > 25 * 1024 * 1024) {
          error = `ZIP "${file.name}" exceeds 25MB.`;
          break;
        }
        newFiles.push(file);
      }
    }

    if (error) {
      setFormData(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          uploadedFiles: error,
        },
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...newFiles],  // Contains both PDFs and ZIP (max 5 PDFs, 1 ZIP)
      errors: {
        ...prev.errors,
        uploadedFiles: undefined,
      },
    }));
  };


 const handleGroupLeaderSignatureUpload = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    setFormData((prev) => ({
      ...prev,
      groupLeaderSignature: file,
      errors: { ...prev.errors, groupLeaderSignature: null },
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      errors: { ...prev.errors, groupLeaderSignature: "Only image files are allowed." },
    }));
  }
};

const handleGuideSignatureUpload = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    setFormData((prev) => ({
      ...prev,
      guideSignature: file,
      errors: { ...prev.errors, guideSignature: null },
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      errors: { ...prev.errors, guideSignature: "Only image files are allowed." },
    }));
  }
};
  
  const addStudentRow = () => {
    setFormData({
      ...formData,
      students: [
        ...formData.students,
        { name: "", year: "", class: "", div: "", branch: "", rollNo: "", mobileNo: "" },
      ],
    });
  };

  const addExpenseRow = () => {
    setFormData({
      ...formData,
      expenses: [...formData.expenses, { category: "", amount: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔍 Submit clicked");

    if (!validateForm()) {
      console.log("❌ Validation failed");
      return;
    }

    let svvNetId = null;
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        svvNetId = user.svvNetId;
      } catch (err) {
        setUserMessage({ text: "User session corrupted.", type: "error" });
        return;
      }
    }

    if (!svvNetId) {
      setUserMessage({ text: "Authentication error. Please log in.", type: "error" });
      return;
    }

    try {
      // STEP 1: Submit base form data
      const formPayload = {
        svvNetId,
        projectTitle: formData.projectTitle?.trim() || "",
        projectDescription: formData.projectDescription?.trim() || "",
        utility: formData.utility?.trim() || "",
        receivedFinance: formData.receivedFinance,
        financeDetails: formData.financeDetails?.trim() || "",
        totalBudget: formData.totalBudget,
        status: formData.status?.trim() || "",
        guideDetails: formData.guideDetails
          .filter(g => g.name?.trim() && g.employeeCode?.trim())
          .map(g => ({
            name: g.name.trim(),
            employeeCode: g.employeeCode.trim(),
          })),
        students: formData.students,
        expenses: formData.expenses
          .filter(exp => exp.category?.trim())
          .map(exp => ({
            category: exp.category.trim(),
            amount: parseFloat(exp.amount) || 0,
            details: exp.details?.trim() || "",
          })),
      };

      const saveRes = await axios.post(
        "http://localhost:5000/api/ug2form/saveFormData",
        formPayload
      );

      if (!saveRes.data?.formId) {
        throw new Error("Form save failed or no form ID returned.");
      }

      const formId = saveRes.data.formId;
      console.log("✅ Form saved with ID:", formId);

      // STEP 2: Upload PDF files
      const uploadedFiles = formData.uploadedFiles.filter(f => f instanceof File);
      const pdfFiles = uploadedFiles.filter(f => f.type === "application/pdf");
      const zipFile = uploadedFiles.find(f => f.name.toLowerCase().endsWith(".zip"));

      for (let pdf of pdfFiles) {
        const pdfForm = new FormData();
        pdfForm.append("pdf", pdf);

        await axios.post(
          `http://localhost:5000/api/ug2form/uploadPDF/${formId}`,
          pdfForm,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      // STEP 3: Upload ZIP file (if any)
      if (zipFile) {
        const zipForm = new FormData();
        zipForm.append("zip", zipFile);

        await axios.post(
          `http://localhost:5000/api/ug2form/uploadZip/${formId}`,
          zipForm,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      // STEP 4: Upload signatures
      const uploadSignature = async (file, type) => {
        const sigForm = new FormData();
        sigForm.append("sig", file);

        await axios.post(
          `http://localhost:5000/api/ug2form/uploadSignature/${formId}/${type}`,
          sigForm,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      };

      if (formData.groupLeaderSignature instanceof File) {
        await uploadSignature(formData.groupLeaderSignature, "groupLeader");
      }

      if (formData.guideSignature instanceof File) {
        await uploadSignature(formData.guideSignature, "guide");
      }

      // STEP 5: Done 🎉
      alert(`✅ Form submitted successfully!\nSubmission ID: ${formId}`);
      setFormData(initialState); // Clear form
      setUserMessage(null);

    } catch (error) {
      console.error("❌ Submission error:", error);
      alert("❌ An error occurred during submission.");
    }
  };

  return (
    <div className="form-container">
      <h2>Under Graduate Form 2</h2>
      {viewOnly && data && data.id && <p className="submission-id">Submission ID: {data.id}</p>}
      <p className="form-category">Interdisciplinary Projects (FY to LY Students)</p>
      <form onSubmit={handleSubmit}>
        <label>Title of Proposed Project:</label>
        <input
          type="text"
          name="projectTitle"
          value={formData.projectTitle}
          disabled={viewOnly}
          onChange={handleInputChange}
        />
        {formData.errors.projectTitle && <p className="error-message">{formData.errors.projectTitle}</p>}

        <label>Brief Description of Proposed Work:</label>
        <textarea
          name="projectDescription"
          disabled={viewOnly}
          placeholder="Attach a separate sheet if required"
          value={formData.projectDescription}
          onChange={handleInputChange}
        />
        {formData.errors.projectDescription && <p className="error-message">{formData.errors.projectDescription}</p>}

        <label>Utility:</label>
        <input
          type="text"
          name="utility"
          disabled={viewOnly}
          value={formData.utility}
          onChange={handleInputChange}
        />
        {formData.errors.utility && <p className="error-message">{formData.errors.utility}</p>}

        <label>Whether received finance from any other agency:</label>
        <div className="checkbox-group">
          <input
            type="radio"
            id="yes"
            name="receivedFinance"
            checked={formData.receivedFinance === true}
            onChange={() => setFormData({ ...formData, receivedFinance: true, errors: { ...formData.errors, financeDetails: null } })}
            disabled={viewOnly}
          />
          <label htmlFor="yes">Yes</label>

          <input
            type="radio"
            id="no"
            name="receivedFinance"
            checked={formData.receivedFinance === false}
            onChange={() => setFormData({ ...formData, receivedFinance: false, errors: { ...formData.errors, financeDetails: null } })}
            disabled={viewOnly}
          />
          <label htmlFor="no">No</label>
        </div>

        <label>Details if Yes:</label>
        <textarea
          name="financeDetails"
          disabled={viewOnly || !formData.receivedFinance}
          value={formData.financeDetails}
          onChange={handleInputChange}
        />
        {formData.errors.financeDetails && <p className="error-message">{formData.errors.financeDetails}</p>}

        <div className="guide-table-wrapper">
          <table className="guide-table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Name of Guide/Co-Guide</th>
                <th>Employee Code</th>
                {!viewOnly && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {formData.guideDetails.map((guide, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      value={guide.name}
                      onChange={(e) => updateGuideField(e, index, "name")}
                      disabled={viewOnly}
                    />
                    {!viewOnly && formData.errors[`guideName_${index}`] && (
                      <p className="error-message">{formData.errors[`guideName_${index}`]}</p>
                    )}
                  </td>
                  <td>
                    <input
                      type="text"
                      value={guide.employeeCode}
                      onChange={(e) => updateGuideField(e, index, "employeeCode")}
                      disabled={viewOnly}
                    />
                    {!viewOnly && formData.errors[`guideEmployeeCode_${index}`] && (
                      <p className="error-message">{formData.errors[`guideEmployeeCode_${index}`]}</p>
                    )}
                  </td>
                  {!viewOnly && (
                    <td>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeGuideRow(index)}
                      >
                        ❌
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {formData.errors.guideDetails && (
            <p className="error-message">{formData.errors.guideDetails}</p>
          )}

          {!viewOnly && (
            <button
              type="button"
              className="add-btn"
              onClick={addGuideRow}
            >
              ➕ Add More Guide
            </button>
          )}
        </div>

        <table className="student-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Name of Student</th>
              <th>Year Of Study</th>
              <th>Class</th>
              <th>Div</th>
              <th>Branch</th>
              <th>Roll No.</th>
              <th>Mobile No.</th>
              {!viewOnly && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {formData.students.map((student, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="text"
                    value={student.name}
                    onChange={(e) => updateStudentField(e, index, "name")}
                    disabled={viewOnly}
                  />
                  {!viewOnly && formData.errors[`studentName_${index}`] && (
                    <p className="error-message">{formData.errors[`studentName_${index}`]}</p>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    value={student.year}
                    onChange={(e) => updateStudentField(e, index, "year")}
                    disabled={viewOnly}
                  />
                  {!viewOnly && formData.errors[`studentYear_${index}`] && (
                    <p className="error-message">{formData.errors[`studentYear_${index}`]}</p>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    value={student.class}
                    onChange={(e) => updateStudentField(e, index, "class")}
                    disabled={viewOnly}
                  />
                  {!viewOnly && formData.errors[`studentClass_${index}`] && (
                    <p className="error-message">{formData.errors[`studentClass_${index}`]}</p>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    value={student.div}
                    onChange={(e) => updateStudentField(e, index, "div")}
                    disabled={viewOnly}
                  />
                  {!viewOnly && formData.errors[`studentDiv_${index}`] && (
                    <p className="error-message">{formData.errors[`studentDiv_${index}`]}</p>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    value={student.branch}
                    onChange={(e) => updateStudentField(e, index, "branch")}
                    disabled={viewOnly}
                  />
                  {!viewOnly && formData.errors[`studentBranch_${index}`] && (
                    <p className="error-message">{formData.errors[`studentBranch_${index}`]}</p>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    value={student.rollNo}
                    onChange={(e) => updateStudentField(e, index, "rollNo")}
                    disabled={viewOnly}
                  />
                  {!viewOnly && formData.errors[`studentRollNo_${index}`] && (
                    <p className="error-message">{formData.errors[`studentRollNo_${index}`]}</p>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    value={student.mobileNo}
                    onChange={(e) => updateStudentField(e, index, "mobileNo")}
                    disabled={viewOnly}
                  />
                  {!viewOnly && formData.errors[`studentMobileNo_${index}`] && (
                    <p className="error-message">{formData.errors[`studentMobileNo_${index}`]}</p>
                  )}
                </td>
                {!viewOnly && (
                    <td>
                        <button type="button" className="remove-btn" onClick={() => removeStudentRow(index)}>
                        ❌
                        </button>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {formData.errors.students && <p className="error-message">{formData.errors.students}</p>}
        {!viewOnly && (
          <button type="button" className="add-btn" onClick={addStudentRow}>
            ➕ Add More Student
          </button>
        )}

        <table className="budget-table">
          <thead>
            <tr>
              <th>Expense Category</th>
              <th>Amount</th>
              <th>Details</th>
              {!viewOnly && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {formData.expenses.map((expense, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={expense.category}
                    onChange={(e) => updateExpenseField(e, index, "category")}
                    disabled={viewOnly}
                  />
                  {!viewOnly && formData.errors[`expenseCategory_${index}`] && (
                    <p className="error-message">{formData.errors[`expenseCategory_${index}`]}</p>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    value={expense.amount}
                    onChange={(e) => updateExpenseField(e, index, "amount")}
                    disabled={viewOnly}
                  />
                  {!viewOnly && formData.errors[`expenseAmount_${index}`] && (
                    <p className="error-message">{formData.errors[`expenseAmount_${index}`]}</p>
                  )}
                </td>
                <td>
                  <textarea
                    value={expense.details}
                    onChange={(e) => updateExpenseField(e, index, "details")}
                    disabled={viewOnly}
                  />
                </td>
                {!viewOnly && (
                    <td>
                        <button type="button" className="remove-btn" onClick={() => removeExpenseRow(index)}>
                        ❌
                        </button>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {!viewOnly && (
          <button type="button" className="add-btn" onClick={addExpenseRow}>
            ➕ Add More Expense
          </button>
        )}

        <label>Total Budget (Including Contingency Amount):</label>
        <input
          type="text"
          disabled={viewOnly}
          name="totalBudget"
          value={formData.totalBudget}
          onChange={handleInputChange}
        />
        {formData.errors.totalBudget && <p className="error-message">{formData.errors.totalBudget}</p>}

        {/* Signatures */}
      <div className="signatures">
        <div>
          <label>Signature of Group Leader (JPEG Only)</label>
          {!viewOnly && (
            <input
              type="file"
              accept=".jpeg,.jpg,image/jpeg,image/jpg"
              name="groupLeaderSignature"
              onChange={handleGroupLeaderSignatureUpload}
              disabled={viewOnly}
            />
          )}
          {viewOnly && formData.groupLeaderSignature?.url ? (
            <img
              src={formData.groupLeaderSignature.url}
              alt="Group Leader Signature"
              className="signature-display"
            />
          ) : formData.groupLeaderSignature?.name ? (
            <p className="file-name">{formData.groupLeaderSignature.name}</p>
          ) : null}
          {!viewOnly && formData.errors.groupLeaderSignature && (
            <p className="error-message">{formData.errors.groupLeaderSignature}</p>
          )}
        </div>

        <div>
          <label>Signature of Guide (JPEG Only)</label>
          {!viewOnly && (
            <input
              type="file"
              accept=".jpeg,.jpg,image/jpeg,image/jpg"
              name="guideSignature"
              onChange={handleGuideSignatureUpload}
              disabled={viewOnly}
            />
          )}
          {viewOnly && formData.guideSignature?.url ? (
            <img
              src={formData.guideSignature.url}
              alt="Guide Signature"
              className="signature-display"
            />
          ) : formData.guideSignature?.name ? (
            <p className="file-name">{formData.guideSignature.name}</p>
          ) : null}
          {!viewOnly && formData.errors.guideSignature && (
            <p className="error-message">{formData.errors.guideSignature}</p>
          )}
        </div>
      </div>
        <label>
          Upload Additional Documents (Max 5 PDF files, 5MB each OR one ZIP file up to 25MB):
        </label>
          {!viewOnly && (
          <input
            type="file"
            accept=".pdf,application/pdf,.zip,application/zip,application/x-zip-compressed"
            multiple
            name="uploadedFiles"
            onChange={handleFileUpload}
            disabled={viewOnly}
          />
        )}
        {formData.uploadedFiles.length > 0 && (
          <div className="uploaded-files-list">
            <h4>Uploaded Files:</h4>
            <ul>
              {formData.uploadedFiles.map((file, index) => {
                const fileName = file.name || file.originalName || "Unnamed";
                const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

                return (
                  <li key={index}>
                    {viewOnly && file.url ? (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {fileName} ({file.mimetype}, {fileSizeMB} MB)
                      </a>
                    ) : (
                      <>
                        {fileName} ({fileSizeMB} MB)
                        {!viewOnly && (
                          <button
                            type="button"
                            className="remove-file-btn"
                            onClick={() => removeUploadedFile(index)}
                          >
                            ❌
                          </button>
                        )}
                      </>
                    )}

                    {!viewOnly && formData.errors[`uploadedFile_${index}`] && (
                      <p className="error-message">
                        {formData.errors[`uploadedFile_${index}`]}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* General error for uploadedFiles (e.g., if more than 5 files are not a single zip) */}
        {!viewOnly && formData.errors.uploadedFiles && <p className="error-message">{formData.errors.uploadedFiles}</p>}
        <button type="button" className="back-btn" onClick={handleBack} disabled={isSubmitting}>Back</button>
        {!viewOnly && (
          <button type="submit" disabled={isSubmitting} className="submit-btn">
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </form>
    </div>
  );
};

export default UGForm2;