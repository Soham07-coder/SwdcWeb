import React, { useState } from "react";

const UGForm2 = () => {
  const [formData, setFormData] = useState({
    projectTitle: "",
    projectDescription: "",
    utility: "",
    receivedFinance: false,
    financeDetails: "",
    guideName: "",
    guideEmployeeCode: "",
    students: [],
    expenses: [],
    totalBudget: "",
    groupLeaderSignature: null,
    guideSignature: null,
    uploadedFile: null,
    errorMessage: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
  
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Limit to 5MB
        alert("File size must be under 5MB.");
        return;
      }
      setFormData({ ...formData, [name]: file });
    }
  };

  const addStudentRow = () => {
    setFormData({
      ...formData,
      students: [...formData.students, { srNo: "", name: "",year: "" , class: "", div: "", branch: "", rollNo: "", mobileNo: "" }],
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

  const addExpenseRow = () => {
    setFormData({
      ...formData,
      expenses: [...formData.expenses, { category: "", amount: "", details: "" }],
    });
  };

  const updateExpenseField = (e, index, field) => {
    const updatedExpenses = [...formData.expenses];
    updatedExpenses[index][field] = e.target.value;
    setFormData({ ...formData, expenses: updatedExpenses });
  };

  const removeExpenseRow = (index) => {
    const updatedExpenses = [...formData.expenses];
    updatedExpenses.splice(index, 1);
    setFormData({ ...formData, expenses: updatedExpenses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formDataToSend = {
        projectTitle: formData.projectTitle,
        projectDescription: formData.projectDescription, 
        projectUtility: formData.utility,
        finance: formData.financeDetails,
        employeeCode: formData.guideEmployeeCode,
        amountClaimed: formData.totalBudget,
        receivedFinance: formData.receivedFinance,
        guideName: formData.guideName,
        students: formData.students,
        expenses: formData.expenses,
      };
  
      const response = await fetch("http://localhost:5000/api/ug2form/saveFormData", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // ✅ Set JSON header
        body: JSON.stringify(formDataToSend), // ✅ Convert to JSON
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("✅ Form Submitted Successfully", data);
        alert("Form submitted successfully!");
      } else {
        console.error("❌ Submission Failed:", data);
        alert("Error: " + (data.message || "Something went wrong"));
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("Submission failed! Please try again.");
    }
  };
  
  
  return (
    <div className="form-container">
      <h2>Under Graduate Form 2</h2>
      <p className="form-category">Interdisciplinary Projects (FY to LY Students)</p>
      <form onSubmit={handleSubmit}>
      <label>Title of Proposed Project:</label>
      <input type="text" name="projectTitle" value={formData.projectTitle} onChange={handleInputChange} />

      <label>Brief Description of Proposed Work:</label>
      <textarea name="projectDescription" placeholder="Attach a separate sheet if required" value={formData.projectDescription} onChange={handleInputChange} />

      <label>Utility:</label>
      <input type="text" name="utility" value={formData.utility} onChange={handleInputChange} />

      <label>Whether received finance from any other agency:</label>
      <div className="checkbox-group">
      <input type="radio" id="yes" name="receivedFinance" checked={formData.receivedFinance === true} onChange={() => setFormData({ ...formData, receivedFinance: true })} />
      <label htmlFor="yes">Yes</label>

      <input type="radio" id="no" name="receivedFinance" checked={formData.receivedFinance === false} onChange={() => setFormData({ ...formData, receivedFinance: false })} />
      <label htmlFor="no">No</label>
      </div>

      <label>Details if Yes:</label>
      <textarea name="financeDetails" value={formData.financeDetails} onChange={handleInputChange} />

      <div className="guide-details">
        <div>
          <label>Name of the Guide/Co-Guide:</label>
          <input type="text" name="guideName" value={formData.guideName} onChange={handleInputChange} />
        </div>
        <div>
          <label>Employee Code:</label>
          <input type="text" name="guideEmployeeCode" value={formData.guideEmployeeCode} onChange={handleInputChange} />
        </div>
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {formData.students.map((student, index) => (
            <tr key={index}>
              {Object.keys(student).map((key) => (
                <td key={key}>
                  <input type="text" value={student[key]} onChange={(e) => updateStudentField(e, index, key)} />
                </td>
              ))}
              <td><button type="button" className="remove-btn" onClick={() => removeStudentRow(index)}>❌</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="add-btn" onClick={addStudentRow}>➕ Add More Student</button>

      <table className="budget-table">
        <thead>
          <tr>
            <th>Expense Category</th>
            <th>Amount</th>
            <th>Details</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {formData.expenses.map((expense, index) => (
            <tr key={index}>
              {Object.keys(expense).map((key) => (
                <td key={key}>
                  {key === "details" ? (
                    <textarea value={expense[key]} onChange={(e) => updateExpenseField(e, index, key)} />
                  ) : (
                    <input type="text" value={expense[key]} onChange={(e) => updateExpenseField(e, index, key)} />
                  )}
                </td>
              ))}
              <td><button type="button" className="remove-btn" onClick={() => removeExpenseRow(index)}>❌</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="add-btn" onClick={addExpenseRow}>➕ Add More Expense</button>

      <label>Total Budget (Including Contingency Amount):</label>
      <input type="text" name="totalBudget" value={formData.totalBudget} onChange={handleInputChange} />

      <div className="signatures">
        <div>
          <label>Signature of Group Leader (JPEG Only)</label>
          <input type="file" accept="image/jpeg" name="groupLeaderSignature" onChange={(e) => handleFileUpload(e, "signature")} />
          {formData.groupLeaderSignature && <p className="file-name">{formData.groupLeaderSignature.name}</p>}
        </div>

        <div>
          <label>Signature of Guide (JPEG Only)</label>
          <input type="file" accept="image/jpeg" name="guideSignature" onChange={(e) => handleFileUpload(e, "signature")} />
          {formData.guideSignature && <p className="file-name">{formData.guideSignature.name}</p>}
        </div>
      </div>

      <label>Upload Additional Documents (PDF Only, Max 5MB)</label>
      <input type="file" accept="application/pdf" onChange={(e) => handleFileUpload(e, "document")} />
      {formData.uploadedFile && <p className="file-name">{formData.uploadedFile.name}</p>}

      {formData.errorMessage && <p className="error-message">{formData.errorMessage}</p>}

      <div className="form-actions">
        <button className="back-btn">Back</button>
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>
      </form>
    </div>
  );
};

export default UGForm2;
