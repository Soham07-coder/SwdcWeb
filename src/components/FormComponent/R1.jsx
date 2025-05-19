import React, { useState } from 'react';

const R1 = () => {
  const [formData, setFormData] = useState({
    guideName: '',
    coGuideName: '',
    employeeCodes: '',
    studentName: '',
    yearOfAdmission: '',
    branch: '',
    rollNo: '',
    mobileNo: '',
    feesPaid: 'No',
    receivedFinance: 'No',
    financeDetails: '',
    paperTitle: '',
    paperLink: '',
    authors: ['', '', '', ''],
    sttpTitle: '',
    organizers: '',
    reasonForAttending: '',
    numberOfDays: '',
    dateFrom: '',
    dateTo: '',
    registrationFee: '',
    bankDetails: {
      beneficiary: '',
      ifsc: '',
      bankName: '',
      branch: '',
      accountType: '',
      accountNumber: ''
    },
    amountClaimed: '',
    finalAmountSanctioned: ''
  });

  const [files, setFiles] = useState({
    proofDocument: null,
    receiptCopy: null,
    studentSignature: null,
    guideSignature: null,
    hodSignature: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [name]: value }
    }));
  };

  const handleAuthorChange = (index, value) => {
    const newAuthors = [...formData.authors];
    newAuthors[index] = value;
    setFormData(prev => ({ ...prev, authors: newAuthors }));
  };

  const handleFileChange = (field, e) => {
    setFiles({
      ...files,
      [field]: e.target.files[0]
    });
  };

  return (
    <div className="form-container max-w-4xl mx-auto p-5 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Research Form R1</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Application Form</h2>
        
        {/* Guide and Student Information */}
        <table className="w-full mb-6 border border-gray-300">
          <tbody>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Name/s of the guide / co-guide (wherever applicable)</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="guideName"
                  value={formData.guideName}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                  placeholder="Guide Name"
                />
                <input
                  type="text"
                  name="coGuideName"
                  value={formData.coGuideName}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded mt-2"
                  placeholder="Co-guide Name"
                />
              </td>
              <th className="p-2 border border-gray-300 bg-gray-100">Employee Codes</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="employeeCodes"
                  value={formData.employeeCodes}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
            </tr>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Name of the student</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
              <th className="p-2 border border-gray-300 bg-gray-100">Year of Admission</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="yearOfAdmission"
                  value={formData.yearOfAdmission}
                  onChange={handleChange}
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
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
              <th className="p-2 border border-gray-300 bg-gray-100">Roll No.</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
            </tr>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Mobile No.</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
              <th className="p-2 border border-gray-300 bg-gray-100">Whether Paid fees for Current Academic Year</th>
              <td className="p-2 border border-gray-300">
                <select
                  name="feesPaid"
                  value={formData.feesPaid}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
            </tr>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Whether received finance from any other agency</th>
              <td className="p-2 border border-gray-300">
                <select
                  name="receivedFinance"
                  value={formData.receivedFinance}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
              <td colSpan="2" className="p-2 border border-gray-300">
                {formData.receivedFinance === 'Yes' && (
                  <input
                    type="text"
                    name="financeDetails"
                    value={formData.financeDetails}
                    onChange={handleChange}
                    className="w-full p-1 border border-gray-300 rounded"
                    placeholder="Provide details"
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Journal/Paper/Poster Section */}
        <div className="mb-6 p-4 border border-gray-300 rounded">
          <h3 className="font-semibold mb-4 text-lg">For Journal/Paper/Poster Presentation</h3>
          
          <div className="mb-4">
            <label className="block font-semibold mb-1">Title of Paper</label>
            <input
              type="text"
              name="paperTitle"
              value={formData.paperTitle}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-semibold mb-1">If paper is available online, then state link</label>
            <input
              type="url"
              name="paperLink"
              value={formData.paperLink}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-semibold mb-1">Names of Authors</label>
            <div className="grid grid-cols-2 gap-4">
              {formData.authors.map((author, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => handleAuthorChange(index, e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded"
                    placeholder={`Author ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STTP/Workshop Section */}
        <div className="mb-6 p-4 border border-gray-300 rounded">
          <h3 className="font-semibold mb-4 text-lg">For attending STTP/Workshops</h3>
          
          <div className="mb-4">
            <label className="block font-semibold mb-1">Title of the STTP/Workshop</label>
            <input
              type="text"
              name="sttpTitle"
              value={formData.sttpTitle}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-semibold mb-1">Name and address of organizers (give website also)</label>
            <input
              type="text"
              name="organizers"
              value={formData.organizers}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-semibold mb-1">Brief reason for attending the Workshop/STTP</label>
            <textarea
              name="reasonForAttending"
              value={formData.reasonForAttending}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded h-20"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1">Number of days of Workshop/STTP</label>
              <input
                type="number"
                name="numberOfDays"
                value={formData.numberOfDays}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">From Date</label>
              <input
                type="date"
                name="dateFrom"
                value={formData.dateFrom}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">To Date</label>
              <input
                type="date"
                name="dateTo"
                value={formData.dateTo}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        <p className="text-sm italic mb-6 text-gray-600">*Attach a copy of paper published / presented / proof of participation/registration fee receipt</p>

        {/* Bank Details */}
        <table className="w-full mb-6 border border-gray-300">
          <tbody>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100" colSpan="2">Bank details for RTGS/NEFT</th>
            </tr>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Registration fee paid: Rs.</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="registrationFee"
                  value={formData.registrationFee}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                  placeholder="Rs.___________"
                />
              </td>
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
            <label className="block font-semibold mb-2">Attach proof documents:</label>
            <div className="flex items-center">
              <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                Choose File
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange('proofDocument', e)}
                />
              </label>
              <span className="ml-2 text-sm">
                {files.proofDocument ? files.proofDocument.name : "No file chosen"}
              </span>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Attach registration fee receipt:</label>
            <div className="flex items-center">
              <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                Choose File
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange('receiptCopy', e)}
                />
              </label>
              <span className="ml-2 text-sm">
                {files.receiptCopy ? files.receiptCopy.name : "No file chosen"}
              </span>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="mb-6">
          <div className="mb-4">
            <label className="block font-semibold mb-2">Date of Submission:</label>
            <input
              type="date"
              className="w-full p-1 border border-gray-300 rounded max-w-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-2">Signature of the student</label>
              <div className="flex items-center">
                <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                  Upload Signature
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
              <label className="block font-semibold mb-2">Signature of Guide / Co-guide</label>
              <div className="flex items-center">
                <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                  Upload Signature
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
                Upload Signature
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

        {/* Approval Section */}
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
              <th className="p-2 border border-gray-300 bg-gray-100">Final Amount sanctioned</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="finalAmountSanctioned"
                  value={formData.finalAmountSanctioned}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                  placeholder="Rs.___________"
                />
              </td>
            </tr>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Signature of chairperson of SDC with date:</th>
              <td colSpan="3" className="p-2 border border-gray-300">
                <div className="flex items-center">
                  <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                    Upload Signature
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                  <input
                    type="date"
                    className="ml-2 p-1 border border-gray-300 rounded"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Approved / Not Approved Principal</th>
              <td colSpan="3" className="p-2 border border-gray-300">
                <select className="w-full p-1 border border-gray-300 rounded max-w-xs">
                  <option>Approved</option>
                  <option>Not Approved</option>
                </select>
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

export default R1;