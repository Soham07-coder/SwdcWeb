import React, { useState } from 'react';

const PG_2_A = () => {
  const [formData, setFormData] = useState({
    organizingInstitute: '',
    projectTitle: '',
    studentDetails: [{
      name: '',
      class: '',
      division: '',
      branch: '',
      rollNo: '',
      mobileNo: ''
    }],
    expenses: [{
      description: '',
      amount: ''
    }],
    bankDetails: {
      beneficiary: '',
      ifsc: '',
      bankName: '',
      branch: '',
      accountType: '',
      accountNumber: ''
    },
    amountClaimed: '',
    amountRecommended: '',
    comments: '',
    finalAmount: ''
  });

  const [files, setFiles] = useState({
    bills: [],
    studentSignature: null,
    guideSignature: null,
    hodSignature: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentChange = (index, field, value) => {
    const newStudents = [...formData.studentDetails];
    newStudents[index][field] = value;
    setFormData(prev => ({ ...prev, studentDetails: newStudents }));
  };

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...formData.expenses];
    newExpenses[index][field] = value;
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
    if (field === 'bills') {
      setFiles({ ...files, bills: [...e.target.files] });
    } else {
      setFiles({ ...files, [field]: e.target.files[0] });
    }
  };

  const addStudent = () => {
    setFormData(prev => ({
      ...prev,
      studentDetails: [...prev.studentDetails, {
        name: '',
        class: '',
        division: '',
        branch: '',
        rollNo: '',
        mobileNo: ''
      }]
    }));
  };

  const addExpense = () => {
    setFormData(prev => ({
      ...prev,
      expenses: [...prev.expenses, { description: '', amount: '' }]
    }));
  };

  return (
    <div className="form-container max-w-4xl mx-auto p-5 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Post Graduate Form 2A - Project Competition</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Application Form</h2>
        
        {/* Organizing Institute */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Name and brief address of the organising institute</label>
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
                <th className="p-2 border border-gray-300">Name of the student</th>
                <th className="p-2 border border-gray-300">Class</th>
                <th className="p-2 border border-gray-300">Div</th>
                <th className="p-2 border border-gray-300">Branch</th>
                <th className="p-2 border border-gray-300">Roll No.</th>
                <th className="p-2 border border-gray-300">Mobile No.</th>
              </tr>
            </thead>
            <tbody>
              {formData.studentDetails.map((student, index) => (
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
                      value={student.division}
                      onChange={(e) => handleStudentChange(index, 'division', e.target.value)}
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
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addStudent}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Student
          </button>
        </div>

        {/* Expenses */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Details of expenses made strictly in following table. Attach bills in the order of serial no.</h3>
          <table className="w-full mb-4 border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border border-gray-300">Sr. No.</th>
                <th className="p-2 border border-gray-300">Description of components / parts / heads of expenses</th>
                <th className="p-2 border border-gray-300">Amount (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {formData.expenses.map((expense, index) => (
                <tr key={index}>
                  <td className="p-2 border border-gray-300">{index + 1}</td>
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
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td className="p-2 border border-gray-300 font-semibold">Total</td>
                <td className="p-2 border border-gray-300"></td>
                <td className="p-2 border border-gray-300">
                  {formData.expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0)}
                </td>
              </tr>
            </tbody>
          </table>
          <button
            onClick={addExpense}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Expense
          </button>
        </div>

        {/* Bank Details */}
        <table className="w-full mb-6 border border-gray-300">
          <tbody>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100" colSpan="2">Bank details for RTGS/NEFT</th>
            </tr>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Beneficiary name, brief address and mobile no.</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="beneficiary"
                  value={formData.bankDetails.beneficiary}
                  onChange={handleBankChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
            </tr>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">IFSC Code</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="ifsc"
                  value={formData.bankDetails.ifsc}
                  onChange={handleBankChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
            </tr>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Name of the bank</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankDetails.bankName}
                  onChange={handleBankChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
            </tr>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Branch</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="branch"
                  value={formData.bankDetails.branch}
                  onChange={handleBankChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
            </tr>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Account type</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="accountType"
                  value={formData.bankDetails.accountType}
                  onChange={handleBankChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
            </tr>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Account number</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.bankDetails.accountNumber}
                  onChange={handleBankChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* File Uploads */}
        <div className="mb-6 space-y-4">
          <div>
            <label className="block font-semibold mb-2">Attach bills (in order of serial no.):</label>
            <div className="flex items-center">
              <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                Choose Files
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={(e) => handleFileChange('bills', e)}
                />
              </label>
              <span className="ml-2 text-sm">
                {files.bills.length > 0 ? `${files.bills.length} files chosen` : "No files chosen"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Signature of student</label>
              <div className="flex items-center">
                <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange('studentSignature', e)}
                  />
                </label>
                <span className="ml-2 text-sm">
                  {files.studentSignature ? files.studentSignature.name : "No file chosen"}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Signature of Guide / Faculty</label>
              <div className="flex items-center">
                <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange('guideSignature', e)}
                  />
                </label>
                <span className="ml-2 text-sm">
                  {files.guideSignature ? files.guideSignature.name : "No file chosen"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Approval Section */}
        <div className="mb-6">
          <div className="mb-4">
            <label className="block font-semibold mb-2">Date:</label>
            <input
              type="date"
              className="w-full p-1 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Remarks by HOD:</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded h-20"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Signature of HOD</label>
            <div className="flex items-center">
              <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                Choose File
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange('hodSignature', e)}
                />
              </label>
              <span className="ml-2 text-sm">
                {files.hodSignature ? files.hodSignature.name : "No file chosen"}
              </span>
            </div>
          </div>
        </div>

        {/* SDC Committee Section */}
        <table className="w-full mb-6 border border-gray-300">
          <tbody>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Amount claimed</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="amountClaimed"
                  value={formData.amountClaimed}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                  placeholder="Rs.___________"
                />
              </td>
              <th className="p-2 border border-gray-300 bg-gray-100">Amount recommended by SDC department members after verification / evaluation</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="amountRecommended"
                  value={formData.amountRecommended}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                  placeholder="Rs.___________"
                />
              </td>
            </tr>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Comments by the SDC committee if any with final recommendation:</th>
              <td colSpan="3" className="p-2 border border-gray-300">
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded h-20"
                ></textarea>
              </td>
            </tr>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Signature of chairperson of SDC with date:</th>
              <td className="p-2 border border-gray-300"></td>
              <th className="p-2 border border-gray-300 bg-gray-100">Final Amount sanctioned</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="finalAmount"
                  value={formData.finalAmount}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                  placeholder="Rs.___________"
                />
              </td>
            </tr>
          </tbody>
        </table>

        

        {/* Form Actions */}
        <div className="flex justify-between">
          <button className="back-btn bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">
            Back
          </button>
          <button className="submit-btn bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PG_2_A;