import React, { useState, useEffect } from "react";
import axios from "axios";

const UG3AForm = () => {
  const [formData, setFormData] = useState({
    organizingInstitute: '',
    projectTitle: '',
    students: [
      { name: "", class: "", div: "", branch: "", rollNo: "", mobileNo: "" }
    ],
    expenses: [
      { srNo: "1", description: "", amount: "" }
    ],
    bankDetails: {
      beneficiary: "",
      bankName: "",
      branch: "",
      ifsc: "",
      accountNumber: ""
    }
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [files, setFiles] = useState({
    image: null,
    document: null
  });

  const [errorMessage, setErrorMessage] = useState("");

  // Calculate total whenever expenses change
  useEffect(() => {
    const sum = formData.expenses.reduce((total, expense) => {
      const amount = parseFloat(expense.amount) || 0;
      return total + amount;
    }, 0);
    setTotalAmount(sum);
  }, [formData.expenses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentChange = (index, field, value) => {
    const newStudents = [...formData.students];
    newStudents[index][field] = value;
    setFormData(prev => ({ ...prev, students: newStudents }));
  };

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...formData.expenses];
    newExpenses[index][field] = value;
    
    // Auto-increment serial numbers when adding new rows
    if (field === 'amount') {
      // Ensure amount is a valid number
      if (isNaN(value) || value === '') {
        newExpenses[index].amount = '';
      } else {
        newExpenses[index].amount = parseFloat(value) || 0;
      }
    }
    
    setFormData(prev => ({ ...prev, expenses: newExpenses }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [name]: value }
    }));
  };

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    if (field === "image") {
      if (!file.type.startsWith("image/jpeg")) {
        setErrorMessage("Only JPEG format is allowed for images.");
        e.target.value = null;
        return;
      }
      setFiles(prev => ({ ...prev, image: file }));
    } else if (field === "document") {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("File size must be less than 5MB.");
        e.target.value = null;
        return;
      }
      setFiles(prev => ({ ...prev, document: file }));
    }
  
    setErrorMessage("");
  };
  const addStudent = () => {
    setFormData(prev => ({
      ...prev,
      students: [...prev.students, { name: "", class: "", div: "", branch: "", rollNo: "", mobileNo: "" }]
    }));
  };

  const removeStudent = (index) => {
    if (formData.students.length > 1) {
      const newStudents = formData.students.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, students: newStudents }));
    }
  };

  const addExpense = () => {
    const newSrNo = (formData.expenses.length + 1).toString();
    setFormData(prev => ({
      ...prev,
      expenses: [...prev.expenses, { srNo: newSrNo, description: "", amount: "" }]
    }));
  };

  const removeExpense = (index) => {
    if (formData.expenses.length > 1) {
      const newExpenses = formData.expenses.filter((_, i) => i !== index)
        .map((expense, i) => ({ ...expense, srNo: (i + 1).toString() }));
      setFormData(prev => ({ ...prev, expenses: newExpenses }));
    }
  };

  const handleSubmit = async () => {
    const form = new FormData();
    form.append("organizingInstitute", formData.organizingInstitute);
    form.append("projectTitle", formData.projectTitle);
    form.append("students", JSON.stringify(formData.students));
    form.append("expenses", JSON.stringify(formData.expenses));
    form.append("bankDetails", JSON.stringify(formData.bankDetails));
    
    if (files.image) form.append("image", files.image);
    if (files.document) form.append("document", files.document);
  
    try {
      await axios.post("http://localhost:5000/api/ug3aform/submit", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Form submitted successfully!");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Form submission failed.");
    }
  };

  return (
    <div className="form-container max-w-4xl mx-auto p-5 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Under Graduate Form 3A - Project Competition</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Application Form</h2>
        
        {/* Organizing Institute */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Name and Address of Organizing Institute:</label>
          <input
            type="text"
            name="organizingInstitute"
            value={formData.organizingInstitute}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Project Title */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Title of Project:</label>
          <input
            type="text"
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Student Details */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Student Details</h3>
          <table className="w-full mb-4 border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border border-gray-300">Name of Student</th>
                <th className="p-2 border border-gray-300">Class</th>
                <th className="p-2 border border-gray-300">Div</th>
                <th className="p-2 border border-gray-300">Branch</th>
                <th className="p-2 border border-gray-300">Roll No.</th>
                <th className="p-2 border border-gray-300">Mobile No.</th>
                <th className="p-2 border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.students.map((student, index) => (
                <tr key={index}>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      value={student.name}
                      onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      value={student.class}
                      onChange={(e) => handleStudentChange(index, 'class', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      value={student.div}
                      onChange={(e) => handleStudentChange(index, 'div', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      value={student.branch}
                      onChange={(e) => handleStudentChange(index, 'branch', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      value={student.rollNo}
                      onChange={(e) => handleStudentChange(index, 'rollNo', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      value={student.mobileNo}
                      onChange={(e) => handleStudentChange(index, 'mobileNo', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeStudent(index)}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={addStudent}
          >
            ➕ Add More Student
          </button>
        </div>

        {/* Expenses */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Details of Expenses</h3>
          <table className="w-full mb-4 border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border border-gray-300">Sr. No.</th>
                <th className="p-2 border border-gray-300">Description</th>
                <th className="p-2 border border-gray-300">Amount (₹)</th>
                <th className="p-2 border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.expenses.map((expense, index) => (
                <tr key={index}>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      value={expense.srNo}
                      readOnly
                      className="w-full p-1 border border-gray-300 rounded bg-gray-100"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      value={expense.description}
                      onChange={(e) => handleExpenseChange(index, 'description', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="number"
                      value={expense.amount}
                      onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded"
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeExpense(index)}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="p-2 border border-gray-300" colSpan="2">Total Amount</td>
                <td className="p-2 border border-gray-300">
                  ₹{totalAmount.toFixed(2)}
                </td>
                <td className="p-2 border border-gray-300"></td>
              </tr>
            </tbody>
          </table>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={addExpense}
          >
            ➕ Add More Expense
          </button>
        </div>

        {/* Bank Details */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Bank Details for RTGS/NEFT</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block font-semibold mb-1">Beneficiary name, brief address and mobile no.:</label>
              <input
                type="text"
                name="beneficiary"
                value={formData.bankDetails.beneficiary}
                onChange={handleBankChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Bank Name:</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankDetails.bankName}
                  onChange={handleBankChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Branch:</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.bankDetails.branch}
                  onChange={handleBankChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">IFSC Code:</label>
                <input
                  type="text"
                  name="ifsc"
                  value={formData.bankDetails.ifsc}
                  onChange={handleBankChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Account Number:</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.bankDetails.accountNumber}
                  onChange={handleBankChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* File Uploads */}
        <div className="mb-6 space-y-4">
          <div>
            <label className="block font-semibold mb-2">Upload Image (JPEG Only):</label>
            <div className="flex items-center">
              <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                Choose File
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg"
                  onChange={(e) => handleFileChange("image", e)}
                />
              </label>
              {files.image && (
                <span className="ml-2 text-sm">{files.image.name}</span>
              )}
            </div>
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Upload Additional Documents (Max 5MB):</label>
            <div className="flex items-center">
              <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                Choose File
                <input
                  type="file"
                  className="hidden"
                  
                  onChange={(e) => handleFileChange("document", e)}
                />
              </label>
              {files.document && (
                <span className="ml-2 text-sm">{files.document.name}</span>
              )}
            </div>
          </div>
          
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-between">
          <button onClick={() => window.history.back()} className="back-btn bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">
            Back
          </button>
          <button  onClick={handleSubmit} className="submit-btn bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UG3AForm;