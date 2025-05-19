
import React, { useState } from 'react';

const UG_3_B = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    yearOfAdmission: '',
    feesPaid: 'No',
    projectTitle: '',
    guideName: '',
    employeeCode: '',
    conferenceDate: '',
    organization: '',
    publisher: '',
    paperLink: '',
    authors: ['', '', '', ''],
    bankDetails: {
      beneficiary: '',
      ifsc: '',
      bankName: '',
      branch: '',
      accountType: '',
      accountNumber: ''
    },
    registrationFee: '',
    previousClaim: 'No',
    claimDate: '',
    amountReceived: '',
    amountSanctioned: ''
  });

  const [files, setFiles] = useState({
    paperCopy: null,
    groupLeaderSignature: null,
    additionalDocuments: null,
    guideSignature: null
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
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Under Graduate Form 3B - Reputed Conference</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center underline">Application Form</h2>
        
        {/* Student Information */}
        <table className="w-full mb-6 border border-gray-300">
          <tbody>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Name of the Student</th>
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
              <th className="p-2 border border-gray-300 bg-gray-100">Title of the Project</th>
              <td colSpan="5" className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Guide and Conference Information */}
        <table className="w-full mb-6 border border-gray-300">
          <tbody>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Name of the Guide / Co-guide</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="guideName"
                  value={formData.guideName}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
              <th className="p-2 border border-gray-300 bg-gray-100">Employee Code:</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
            </tr>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Date of Conference / Project Competition</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="date"
                  name="conferenceDate"
                  value={formData.conferenceDate}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
              <th className="p-2 border border-gray-300 bg-gray-100">Name and address of organization / institution</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Publisher Information */}
        <table className="w-full mb-6 border border-gray-300">
          <tbody>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Name and Address of the Publisher (For address one may give website address)</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
            </tr>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">If paper is available online, then state link</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="url"
                  name="paperLink"
                  value={formData.paperLink}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Authors */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          {formData.authors.map((author, index) => (
            <div key={index}>
              <label className="block font-semibold mb-1">Author {index + 1} Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => handleAuthorChange(index, e.target.value)}
                className="w-full p-1 border border-gray-300 rounded"
              />
            </div>
          ))}
        </div>

        <p className="text-sm italic mb-6 text-gray-600">*Attach a copy of paper published / presented / proof of participation in project competition along with the Reimbursement Form</p>

        {/* Bank Details */}
        <table className="w-full mb-6 border border-gray-300">
          <tbody>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100" colSpan="2">Bank details for RTGS/NEFT</th>
            </tr>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Beneficiary name, brief address and mobile no. (Student author)</th>
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

        {/* Payment Information */}
        <table className="w-full mb-6 border border-gray-300">
          <tbody>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Registration Fees Paid</th>
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
              <th className="p-2 border border-gray-300 bg-gray-100">Have you claimed previously for any paper / project competition under this scheme:</th>
              <td className="p-2 border border-gray-300">
                <select
                  name="previousClaim"
                  value={formData.previousClaim}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
              <th className="p-2 border border-gray-300 bg-gray-100">Date of Received Claim</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="date"
                  name="claimDate"
                  value={formData.claimDate}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
              <th className="p-2 border border-gray-300 bg-gray-100">Amount Received</th>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="amountReceived"
                  value={formData.amountReceived}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                  placeholder="Rs.___________"
                />
              </td>
            </tr>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100">Amount sanctioned</th>
              <td colSpan="7" className="p-2 border border-gray-300">
                <input
                  type="text"
                  name="amountSanctioned"
                  value={formData.amountSanctioned}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded"
                  placeholder="Rs.___________"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <p className="mb-6 text-gray-700">The participation by the BE / B. Tech student was relevant to their Final Year BE / B. Tech project and affiliation to the institute was clearly mentioned.</p>

        {/* File Uploads */}
        <div className="mb-6 space-y-4">
          <div>
            <label className="block font-semibold mb-2">*Attach proof documents:</label>
            <div className="flex items-center">
              <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                Choose Paper Copy
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange('paperCopy', e)}
                />
              </label>
              <span className="ml-2 text-sm">
                {files.paperCopy ? files.paperCopy.name : "No file chosen"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Signature of Group Leader (JPEG Only)</label>
              <div className="flex items-center">
                <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg"
                    onChange={(e) => handleFileChange('groupLeaderSignature', e)}
                  />
                </label>
                <span className="ml-2 text-sm">
                  {files.groupLeaderSignature ? files.groupLeaderSignature.name : "No file chosen"}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Signature of Guide (JPEG Only)</label>
              <div className="flex items-center">
                <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg"
                    onChange={(e) => handleFileChange('guideSignature', e)}
                  />
                </label>
                <span className="ml-2 text-sm">
                  {files.guideSignature ? files.guideSignature.name : "No file chosen"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Upload Additional Documents (Max 5MB)</label>
            <div className="flex items-center">
              <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                Choose File
                <input
                  type="file"
                  className="hidden"
                  
                  onChange={(e) => handleFileChange('additionalDocuments', e)}
                />
              </label>
              <span className="ml-2 text-sm">
                {files.additionalDocuments ? files.additionalDocuments.name : "No file chosen"}
              </span>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between mb-6">
          <div className="w-1/2 pr-2">
            <p className="font-semibold mb-2">Signature of the Guide/Co-Guide HOD</p>
            <div className="h-12 border-t border-gray-400"></div>
          </div>
         
        </div>

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

export default UG_3_B;
