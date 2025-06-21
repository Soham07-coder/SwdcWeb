import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/UG1.css"; // Ensure this path is correct
import JSZip from "jszip";

const UG1Form = ({ data = null, viewOnly = false }) => {
  // Initial form data structure
  const initialFormData = {
    projectTitle: "",
    projectUtility: "",
    projectDescription: "",
    finance: "", // Default to empty or 'No'
    guideNames: [""],
    employeeCodes: [""],
    svvNetId: "",
    studentDetails: Array(4).fill({
      branch: "",
      yearOfStudy: "",
      studentName: "",
      rollNumber: "",
    }),
    status: "pending",
  };

  const [formData, setFormData] = useState(
    data
      ? {
          projectTitle: data.projectTitle || "",
          projectUtility: data.projectUtility || "",
          projectDescription: data.projectDescription || "",
          finance: data.finance || "",
          guideNames: data.guideNames || [""],
          employeeCodes: data.employeeCodes || [""],
          svvNetId: data.svvNetId || "",
          studentDetails: data.studentDetails || initialFormData.studentDetails,
          status: data.status || "pending",
        }
      : initialFormData
  );

  // State for PDFs and signatures
  // Assumes backend sends file details in the corrected structure
  const [pdfFiles, setPdfFiles] = useState(data?.pdfFiles || []); // Array of {id, name, url} or File objects
  const [zipFile, setZipFile] = useState(data?.zipFileDetails || null); // {id, name, url} or File object or null
  const [groupLeaderSignature, setGroupLeaderSignature] = useState(data?.groupLeaderSignature || null); // {id, name, url} or File object or null
  const [guideSignature, setGuideSignature] = useState(data?.guideSignature || null); // {id, name, url} or File object or null

  const [errorMessage, setErrorMessage] = useState("");
  const [formId, setFormId] = useState(data?._id || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const svvNetIdRef = useRef(""); // Stores svvNetId from localStorage

  // Refs to store original data file info (now storing the full objects or null)
  const originalPdfFilesRef = useRef(data?.pdfFiles || []);
  const originalZipFileRef = useRef(data?.zipFileDetails || null);
  const originalGroupLeaderSignatureRef = useRef(data?.groupLeaderSignature || null);
  const originalGuideSignatureRef = useRef(data?.guideSignature || null);

  useEffect(() => {
    const storedSvvNetId = localStorage.getItem("svvNetId");
    if (storedSvvNetId) {
      svvNetIdRef.current = storedSvvNetId;
      if (!data) { // Only set in formData if it's a new form
        setFormData((prev) => ({ ...prev, svvNetId: storedSvvNetId }));
      }
    }
  }, [data]); // Rerun if `data` changes (e.g. from null to populated)

  useEffect(() => {
    if (data) {
      setFormData({
        projectTitle: data.projectTitle || "",
        projectUtility: data.projectUtility || "",
        projectDescription: data.projectDescription || "",
        finance: data.finance || "",
        guideNames: data.guideNames && data.guideNames.length > 0 ? data.guideNames : [""],
        employeeCodes: data.employeeCodes && data.employeeCodes.length > 0 ? data.employeeCodes : [""],
        svvNetId: data.svvNetId || svvNetIdRef.current, // Use svvNetId from data if available
        studentDetails: data.studentDetails || initialFormData.studentDetails,
        status: data.status || "pending",
      });

      setPdfFiles(data.pdfFiles || []);
      setZipFile(data.zipFileDetails || null);
      setGroupLeaderSignature(data.groupLeaderSignature || null);
      setGuideSignature(data.guideSignature || null);
      setFormId(data._id);

      originalPdfFilesRef.current = data.pdfFiles || [];
      originalZipFileRef.current = data.zipFileDetails || null;
      originalGroupLeaderSignatureRef.current = data.groupLeaderSignature || null;
      originalGuideSignatureRef.current = data.guideSignature || null;
    } else {
        // Reset form if data is null (e.g., navigating away from edit to new form)
        setFormData(prev => ({...initialFormData, svvNetId: svvNetIdRef.current})); // Keep svvNetId from localStorage
        setPdfFiles([]);
        setZipFile(null);
        setGroupLeaderSignature(null);
        setGuideSignature(null);
        setFormId(null);
        originalPdfFilesRef.current = [];
        originalZipFileRef.current = null;
        originalGroupLeaderSignatureRef.current = null;
        originalGuideSignatureRef.current = null;
    }
  }, [data]);


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStudentDetailsChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedStudents = prev.studentDetails.map((student, i) =>
        i === index ? { ...student, [field]: value } : student
      );
      return { ...prev, studentDetails: updatedStudents };
    });
  };

  const handleRadioChange = (value) => {
    setFormData((prev) => ({ ...prev, finance: value }));
  };

  const handleFileUpload = async (e) => {
    if (viewOnly) return;
    const files = Array.from(e.target.files);
    const validFiles = [];

    const currentPdfFileNames = pdfFiles.map(file => file.name); // Assumes file.name exists for both File and {name,url}
    const currentZipFileName = zipFile?.name;
    const existingFileNames = new Set([...currentPdfFileNames, ...(currentZipFileName ? [currentZipFileName] : [])]);

    files.forEach((file) => {
      if (file.type !== "application/pdf") {
        alert("❌ Only PDF files are allowed.");
      } else if (file.size > 5 * 1024 * 1024) {
        alert(`❌ File "${file.name}" must be less than 5MB.`);
      } else if (existingFileNames.has(file.name)) {
        alert(`❌ File "${file.name}" already selected or uploaded.`);
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length === 0) {
        e.target.value = null; // Clear the input if no valid files were added
        return;
    }

    const currentPdfsRetained = pdfFiles.filter(f => f.url); // PDFs already on server
    const totalFilesAfterAddition = currentPdfsRetained.length + validFiles.length;

    if (totalFilesAfterAddition <= 5) {
      setZipFile(null); // Clear any existing zip if we are going with individual PDFs
      setPdfFiles((prev) => {
        const existingServerFiles = prev.filter(f => f.url); // Keep {name,url} from server
        const newLocalFiles = prev.filter(f => f instanceof File); // Keep existing local File objects
        return [...existingServerFiles, ...newLocalFiles, ...validFiles]; // Add new File objects
      });
    } else {
      const zip = new JSZip();
      // Add newly selected valid files to the zip
      validFiles.forEach((file) => zip.file(file.name, file));

      // Add existing local File objects to the zip
      pdfFiles.filter(f => f instanceof File).forEach(localFile => zip.file(localFile.name, localFile));

      // Fetch and add existing PDFs from server (those with URLs)
      const fetchAndAddExistingPdfs = currentPdfsRetained.map(async (uploadedFile) => {
        try {
          const response = await fetch(uploadedFile.url);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for ${uploadedFile.name}`);
          const blob = await response.blob();
          zip.file(uploadedFile.name, blob);
        } catch (error) {
          console.error(`Error fetching existing PDF ${uploadedFile.name} for zipping:`, error);
          alert(`Could not fetch ${uploadedFile.name} to include in the ZIP. It will be skipped.`);
        }
      });
      await Promise.all(fetchAndAddExistingPdfs);

      try {
        const content = await zip.generateAsync({ type: "blob" });
        const zipFileBlob = new File([content], `documents-${Date.now()}.zip`, { type: "application/zip" });
        setZipFile(zipFileBlob);
        setPdfFiles([]); // Clear individual PDFs as they are now in the zip
      } catch (err) {
        console.error("Zip Error:", err);
        alert("❌ Failed to zip files.");
      }
    }
    e.target.value = null;
  };

  const removeFile = async (indexToRemove) => {
    if (viewOnly) return;

    const removedFile = pdfFiles[indexToRemove];
    const updatedPdfs = pdfFiles.filter((_, i) => i !== indexToRemove);

    // If the removed file was one that had a URL (i.e., it's on the server),
    // we might need to explicitly clear it from the backend if the form is saved later.
    // For now, this function only updates frontend state. The actual clearing from DB
    // will be handled by handleUploadDocuments based on comparison with original refs.

    setPdfFiles(updatedPdfs);

    // Re-evaluate if a zip is needed or if existing zip should be updated
    if (zipFile || updatedPdfs.length > 5) { // If there was a zip or still more than 5 files
        const filesToZip = [];
        // Add remaining PDFs (both server URLs and local Files)
        updatedPdfs.forEach(f => filesToZip.push(f));

        if (filesToZip.length === 0 && zipFile) { // No files left but there was a zip
            setZipFile(null); // Clear zip if all constituent files are gone
            return;
        }
        if (filesToZip.length <= 5 && filesToZip.length > 0) { // If remaining files are 5 or less, no zip
            setZipFile(null);
            setPdfFiles(filesToZip); // these are already in the correct format
            return;
        }
        if (filesToZip.length === 0) return; // Nothing to zip

        // Re-zip remaining files
        const zip = new JSZip();
        const fetchAndAddPromises = filesToZip.map(async (fileToZip) => {
            if (fileToZip.url) { // file from server
                try {
                    const response = await fetch(fileToZip.url);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const blob = await response.blob();
                    zip.file(fileToZip.name, blob);
                } catch (error) {
                    console.error(`Error re-fetching PDF ${fileToZip.name} for zipping:`, error);
                }
            } else { // local File object
                zip.file(fileToZip.name, fileToZip);
            }
        });

        await Promise.all(fetchAndAddPromises);

        try {
            const content = await zip.generateAsync({ type: "blob" });
            const zipFileBlob = new File([content], `documents-${Date.now()}.zip`, { type: "application/zip" });
            setZipFile(zipFileBlob);
            setPdfFiles([]); // All are in zip now
        } catch (err) {
            console.error("Re-zip Error after removal:", err);
            alert("❌ Failed to re-zip files after removal.");
            setPdfFiles(updatedPdfs); // Revert to non-zipped if re-zip fails
        }
    }
  };

  const removeZipFile = () => {
    if (viewOnly) return;
    setZipFile(null);
    // Consider restoring individual PDFs if they were from server.
    // For simplicity, user might need to re-upload if they want individual files.
    // Or, if originalPdfFilesRef.current had files, you could potentially restore them to pdfFiles state.
  };

  const handleSignatureUpload = (e, type) => {
    if (viewOnly) return;
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) { // Allow any image type, or be specific e.g. image/jpeg, image/png
      alert("❌ Only image files are allowed for signatures.");
      e.target.value = null;
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert("❌ Signature image must be less than 2MB.");
      e.target.value = null;
      return;
    }

    if (type === "groupLeader") setGroupLeaderSignature(file);
    else if (type === "guide") setGuideSignature(file);
    e.target.value = null;
  };

  const handleGuideChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
  };

  const addGuide = () => {
    setFormData((prev) => ({
      ...prev,
      guideNames: [...prev.guideNames, ""],
      employeeCodes: [...prev.employeeCodes, ""],
    }));
  };

  const removeGuide = (index) => {
    if (formData.guideNames.length <= 1) { // Always keep at least one guide input row
        alert("At least one guide entry is required.");
        return;
    }
    setFormData((prev) => ({
      ...prev,
      guideNames: prev.guideNames.filter((_, i) => i !== index),
      employeeCodes: prev.employeeCodes.filter((_, i) => i !== index),
    }));
  };

  const uploadSignature = async (file, type, currentFormId) => {
    const signatureFormData = new FormData();
    signatureFormData.append("file", file);
    try {
      // console.log(`Uploading ${type} signature for formId: ${currentFormId}`);
      const response = await axios.post(
        `http://localhost:5000/api/ug1form/uploadSignature/${currentFormId}/${type}`,
        signatureFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(`✅ ${type} Signature Uploaded:`, response.data);
    } catch (error) {
      console.error(`❌ Error uploading ${type} signature:`, error.response?.data || error.message);
      throw new Error(`Failed to upload ${type} signature.`);
    }
  };

  const handleUploadDocuments = async (currentFormId) => {
    // console.log("handleUploadDocuments called for formId:", currentFormId);
    // console.log("Current pdfFiles state:", pdfFiles);
    // console.log("Current zipFile state:", zipFile);
    // console.log("Original PDF files:", originalPdfFilesRef.current);
    // console.log("Original ZIP file:", originalZipFileRef.current);

    const isNewZipFileSelected = zipFile instanceof File;
    const newIndividualPdfFiles = pdfFiles.filter(file => file instanceof File);

    const wasZipPreviouslyPresent = originalZipFileRef.current !== null;
    const werePdfsPreviouslyPresent = originalPdfFilesRef.current.length > 0;

    // Determine if DB clear is needed
    // Clear old PDFs if new ZIP is primary, or if all PDFs were removed and no new zip/pdfs.
    const needsClearPdfsInDb = (werePdfsPreviouslyPresent && isNewZipFileSelected) ||
                             (werePdfsPreviouslyPresent && !isNewZipFileSelected && newIndividualPdfFiles.length === 0 && pdfFiles.filter(f=>f.url).length === 0);

    // Clear old ZIP if new individual PDFs are primary, or if zip was removed and no new zip/pdfs.
    const needsClearZipInDb = (wasZipPreviouslyPresent && !isNewZipFileSelected && newIndividualPdfFiles.length > 0) ||
                            (wasZipPreviouslyPresent && !isNewZipFileSelected && zipFile === null);


    if (needsClearPdfsInDb) {
      try {
        // console.log("Attempting to clear old PDF file IDs in DB for formId:", currentFormId);
        await axios.put(`http://localhost:5000/api/ug1form/clearPdfFiles/${currentFormId}`);
        // console.log("Cleared old PDF file IDs in DB.");
        originalPdfFilesRef.current = []; // Reflect that they are cleared
      } catch (clearError) {
        console.error("Error clearing old PDF files in DB:", clearError.response?.data || clearError.message);
        // Decide if this is a critical failure
      }
    }
    if (needsClearZipInDb) {
      try {
        // console.log("Attempting to clear old ZIP file ID in DB for formId:", currentFormId);
        await axios.put(`http://localhost:5000/api/ug1form/clearZipFile/${currentFormId}`);
        // console.log("Cleared old ZIP file ID in DB.");
        originalZipFileRef.current = null; // Reflect that it's cleared
      } catch (clearError) {
        console.error("Error clearing old ZIP file in DB:", clearError.response?.data || clearError.message);
      }
    }

    if (isNewZipFileSelected) {
      const docFormData = new FormData();
      docFormData.append("pdfZip", zipFile); // 'pdfZip' must match backend key
      // console.log("Uploading new ZIP file for formId:", currentFormId);
      await axios.post(`http://localhost:5000/api/ug1form/uploadZip/${currentFormId}`, docFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // console.log("New ZIP file uploaded.");
    } else if (newIndividualPdfFiles.length > 0) {
      for (const file of newIndividualPdfFiles) {
        const docFormData = new FormData();
        docFormData.append("pdfFile", file); // 'pdfFile' must match backend key
        // console.log(`Uploading new PDF ${file.name} for formId:`, currentFormId);
        await axios.post(`http://localhost:5000/api/ug1form/uploadPDF/${currentFormId}`, docFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // console.log(`New PDF ${file.name} uploaded.`);
      }
    } else {
      // console.log("No new documents to upload.");
    }
  };

  const handleSaveFormData = async () => {
    setErrorMessage("");
    const safeTrim = (str) => (typeof str === "string" ? str.trim() : "");

    if (!safeTrim(formData.projectTitle) || !safeTrim(formData.projectUtility) || !safeTrim(formData.projectDescription) || !formData.finance) {
      setErrorMessage("Please fill all required textual fields including finance option.");
      return null;
    }
    if (!formData.guideNames.some(name => safeTrim(name)) || !formData.employeeCodes.some(code => safeTrim(code)) || formData.guideNames.findIndex(name => safeTrim(name) === "") !== formData.employeeCodes.findIndex(code => safeTrim(code) === "")) {
        const guideWithNoCode = formData.guideNames.some((name, index) => safeTrim(name) && !safeTrim(formData.employeeCodes[index]));
        const codeWithNoGuide = formData.employeeCodes.some((code, index) => safeTrim(code) && !safeTrim(formData.guideNames[index]));
        if (guideWithNoCode || codeWithNoGuide || !formData.guideNames.some(name => safeTrim(name))) {
            setErrorMessage("Please provide at least one Guide/Co-Guide name with a corresponding Employee Code. Both fields are required if one is filled.");
            return null;
        }
    }
     const filledStudents = formData.studentDetails.filter(
      (student) =>
        safeTrim(student.studentName) ||
        safeTrim(student.rollNumber) ||
        safeTrim(student.branch) ||
        safeTrim(student.yearOfStudy)
    );

    if (filledStudents.length === 0) {
      setErrorMessage("At least one student's complete details must be filled.");
      return null;
    }

    for (let i = 0; i < filledStudents.length; i++) {
        const student = filledStudents[i];
        if (!safeTrim(student.studentName) || !safeTrim(student.rollNumber) || !safeTrim(student.branch) || !safeTrim(student.yearOfStudy)) {
            setErrorMessage(`Please complete all fields for student ${formData.studentDetails.indexOf(student) + 1} if any field is entered.`);
            return null;
        }
        if (!/^\d{11}$/.test(safeTrim(student.rollNumber))) {
            setErrorMessage(`Roll Number for student ${formData.studentDetails.indexOf(student) + 1} must be exactly 11 digits.`);
            return null;
        }
    }


    if (zipFile instanceof File && zipFile.size > 20 * 1024 * 1024) { // 20MB
      setErrorMessage("The zipped documents file exceeds the 20MB size limit.");
      return null;
    } else if (pdfFiles.some(file => file instanceof File && file.size > 5 * 1024 * 1024)) { // 5MB
      setErrorMessage("One or more PDF files exceed the 5MB size limit.");
      return null;
    }

    if ((groupLeaderSignature === null && !originalGroupLeaderSignatureRef.current) || (groupLeaderSignature instanceof File && groupLeaderSignature.size === 0)) {
      setErrorMessage("Please upload the Group Leader's signature (image).");
      return null;
    }
    if ((guideSignature === null && !originalGuideSignatureRef.current) || (guideSignature instanceof File && guideSignature.size === 0)) {
      setErrorMessage("Please upload the Guide's signature (image).");
      return null;
    }

    const dataToSend = { ...formData, svvNetId: svvNetIdRef.current };
    // Filter out empty student details before sending
    dataToSend.studentDetails = dataToSend.studentDetails.filter(
        s => s.studentName.trim() || s.rollNumber.trim() || s.branch.trim() || s.yearOfStudy.trim()
    );
    // Filter out empty guide/employee code pairs
    const validGuides = [];
    const validCodes = [];
    dataToSend.guideNames.forEach((name, index) => {
        if (safeTrim(name) && safeTrim(dataToSend.employeeCodes[index])) {
            validGuides.push(safeTrim(name));
            validCodes.push(safeTrim(dataToSend.employeeCodes[index]));
        }
    });
    dataToSend.guideNames = validGuides;
    dataToSend.employeeCodes = validCodes;


    // console.log("Data being sent to saveFormData:", JSON.stringify(dataToSend, null, 2));
    try {
      const endpoint = formId ? `http://localhost:5000/api/ug1form/updateFormData/${formId}` : "http://localhost:5000/api/ug1form/saveFormData";
      const method = formId ? "put" : "post";
      
      const response = await axios[method](endpoint, dataToSend);
      
      const returnedFormId = response.data.formId || (formId && response.data.message ? formId : null) ; // If updating, formId might not be in response
      if (returnedFormId) {
        if (!formId) setFormId(returnedFormId); // Set formId if it's a new form
        return returnedFormId;
      } else {
        setErrorMessage(response.data.message || "Failed to save form data. Form ID not received.");
        return null;
      }
    } catch (error) {
      console.error("❌ Error Saving Form Data:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || "Error saving form data. Try again.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (viewOnly || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");
    // console.log("--- Starting Form Submission ---");

    try {
      const currentFormId = await handleSaveFormData(); // This now handles create/update
      if (!currentFormId) {
        setIsSubmitting(false);
        // console.log("Form data save failed, submission halted.");
        return;
      }
      // console.log("Form data saved/updated. Current Form ID:", currentFormId);

      // Documents
      try {
        // console.log("Proceeding to upload/clear documents...");
        await handleUploadDocuments(currentFormId);
      } catch (docErr) {
        console.error("❌ Document Upload/Clear Failed:", docErr.message || docErr);
        setErrorMessage(`Error with documents: ${docErr.message || 'Please try again.'}`);
        // Decide if submission should halt or continue if only non-critical part fails
        // For now, we'll let it try signatures. In production, might halt.
      }

      // Signatures
      try {
        // console.log("Proceeding to upload/clear signatures...");
        if (groupLeaderSignature instanceof File) {
          await uploadSignature(groupLeaderSignature, "groupLeader", currentFormId);
        } else if (groupLeaderSignature === null && originalGroupLeaderSignatureRef.current) {
          // console.log("Clearing group leader signature in DB...");
          await axios.put(`http://localhost:5000/api/ug1form/clearSignature/${currentFormId}/groupLeader`);
          originalGroupLeaderSignatureRef.current = null; // Reflect change
        }

        if (guideSignature instanceof File) {
          await uploadSignature(guideSignature, "guide", currentFormId);
        } else if (guideSignature === null && originalGuideSignatureRef.current) {
          // console.log("Clearing guide signature in DB...");
          await axios.put(`http://localhost:5000/api/ug1form/clearSignature/${currentFormId}/guide`);
          originalGuideSignatureRef.current = null; // Reflect change
        }
      } catch (sigErr) {
        console.error("❌ Signature Upload/Clear Failed:", sigErr.message || sigErr);
        setErrorMessage(`Error with signatures: ${sigErr.message || 'Please try again.'}`);
      }

      alert("✅ Form submitted successfully!");
      // Reset form state or redirect as needed
      // Example: If it was a new form, reset. If edit, maybe just show success.
      if (!data) { // If it was a new submission (not an edit)
        setFormData(prev => ({...initialFormData, svvNetId: svvNetIdRef.current}));
        setPdfFiles([]);
        setZipFile(null);
        setGroupLeaderSignature(null);
        setGuideSignature(null);
        setFormId(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
      }
      // Or redirect: window.location.href = '/success-page';
    } catch (err) { // Catch errors from handleSaveFormData if not caught internally
      console.error("❌ Top Level Submission Error:", err);
      setErrorMessage(err.message || "An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
      // console.log("--- Form Submission Ended ---");
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  // JSX Rendering
  return (
    <div className="form-container ug1-form"> {/* Added specific class for UG1 */}
      <h2>Under Graduate Form 1</h2>
      <p className="form-category">In-house Student Project within Department</p>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="projectTitle">Title of the Project:</label>
        <input
          id="projectTitle"
          type="text"
          value={formData.projectTitle}
          onChange={(e) => handleInputChange("projectTitle", e.target.value)}
          disabled={viewOnly}
          required
        />

        <label htmlFor="projectUtility">Utility of the Project:</label>
        <input
          id="projectUtility"
          type="text"
          value={formData.projectUtility}
          onChange={(e) => handleInputChange("projectUtility", e.target.value)}
          disabled={viewOnly}
          required
        />

        <label htmlFor="projectDescription">Description:</label>
        <textarea
          id="projectDescription"
          value={formData.projectDescription}
          onChange={(e) => handleInputChange("projectDescription", e.target.value)}
          disabled={viewOnly}
          required
        />

        <fieldset className="form-group">
            <legend>Whether received finance from any other agency:</legend>
            <div className="radio-group">
                <label>
                <input type="radio" name="finance" value="Yes" checked={formData.finance === "Yes"} onChange={() => handleRadioChange("Yes")} disabled={viewOnly} required /> Yes
                </label>
                <label>
                <input type="radio" name="finance" value="No" checked={formData.finance === "No"} onChange={() => handleRadioChange("No")} disabled={viewOnly} /> No
                </label>
            </div>
        </fieldset>


        <h3>Guide/Co-Guide Details</h3>
        {formData.guideNames.map((name, index) => (
          <div key={`guide-${index}`} className="guide-details-entry">
            <div className="form-row">
                <div>
                    <label htmlFor={`guideName-${index}`}>Name of Guide/Co-Guide {index + 1}:</label>
                    <input id={`guideName-${index}`} type="text" value={name} onChange={(e) => handleGuideChange(index, "guideNames", e.target.value)} disabled={viewOnly} />
                </div>
                <div>
                    <label htmlFor={`empCode-${index}`}>Employee Code {index + 1}:</label>
                    <input id={`empCode-${index}`} type="text" value={formData.employeeCodes[index]} onChange={(e) => handleGuideChange(index, "employeeCodes", e.target.value)} disabled={viewOnly} />
                </div>
            </div>
            {!viewOnly && formData.guideNames.length > 1 && (
              <button type="button" className="remove-btn-small" onClick={() => removeGuide(index)}>Remove Guide {index+1}</button>
            )}
          </div>
        ))}
        {!viewOnly && (
          <button type="button" className="add-btn" onClick={addGuide}>➕ Add Another Guide</button>
        )}

        <h3>Student Details</h3>
        <div className="table-responsive">
            <table className="student-table">
            <thead>
                <tr>
                <th>Sr. No.</th>
                <th>Branch</th>
                <th>Year of Study</th>
                <th>Student Name</th>
                <th>Roll Number (11 digits)</th>
                </tr>
            </thead>
            <tbody>
                {formData.studentDetails.map((student, index) => (
                <tr key={`student-${index}`}>
                    <td>{index + 1}</td>
                    <td><input type="text" value={student.branch} onChange={(e) => handleStudentDetailsChange(index, "branch", e.target.value)} disabled={viewOnly} /></td>
                    <td><input type="text" value={student.yearOfStudy} onChange={(e) => handleStudentDetailsChange(index, "yearOfStudy", e.target.value)} disabled={viewOnly} /></td>
                    <td><input type="text" value={student.studentName} onChange={(e) => handleStudentDetailsChange(index, "studentName", e.target.value)} disabled={viewOnly} /></td>
                    <td><input type="text" pattern="\d{11}" title="Must be 11 digits" value={student.rollNumber} onChange={(e) => handleStudentDetailsChange(index, "rollNumber", e.target.value)} disabled={viewOnly} /></td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>


        <div className="signatures-section form-row">
          <div className="signature-upload">
            <label htmlFor="groupLeaderSignatureFile">Signature of Group Leader (Image):</label>
            {!viewOnly && (
              <>
                <input
                  id="groupLeaderSignatureFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSignatureUpload(e, "groupLeader")}
                />
                {groupLeaderSignature && (
                  <div className="file-preview">
                    {groupLeaderSignature.url ? (
                      <>
                        <img
                          src={groupLeaderSignature.url}
                          alt={groupLeaderSignature.name || "Group Leader Signature"}
                          className="signature-image-preview"
                        />
                        <a
                          href={groupLeaderSignature.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Current
                        </a>
                      </>
                    ) : (
                      <span>Selected: {groupLeaderSignature.name}</span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="signature-upload">
            <label htmlFor="guideSignatureFile">Signature of Guide (Image):</label>
            {!viewOnly && (
              <>
                <input
                  id="guideSignatureFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSignatureUpload(e, "guide")}
                />
                {guideSignature && (
                  <div className="file-preview">
                    {guideSignature.url ? (
                      <>
                        <img
                          src={guideSignature.url}
                          alt={guideSignature.name || "Guide Signature"}
                          className="signature-image-preview"
                        />
                        <a
                          href={guideSignature.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Current
                        </a>
                      </>
                    ) : (
                      <span>Selected: {guideSignature.name}</span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="supportingDocs">Upload Supporting Documents (PDF only):</label>
          {!viewOnly && (
            <input id="supportingDocs" type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" multiple />
          )}
          <ul className="file-list">
            {pdfFiles.map((file, index) => (
              <li key={`pdf-${index}`}>
                {file.url ? <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a> : file.name}
                {!viewOnly && <button type="button" className="remove-btn-small" onClick={() => removeFile(index)}>Remove</button>}
              </li>
            ))}
            {zipFile && (
              <li>
                {zipFile.url ? <a href={zipFile.url} target="_blank" rel="noopener noreferrer">{zipFile.name} (ZIP)</a> : `${zipFile.name} (ZIP)`}
                {!viewOnly && <button type="button" className="remove-btn-small" onClick={removeZipFile}>Remove ZIP</button>}
              </li>
            )}
            {!zipFile && pdfFiles.length === 0 && <li>No supporting documents selected/uploaded.</li>}
          </ul>
        </div>

        <div className="form-actions">
          <button type="button" className="back-btn" onClick={handleBack} disabled={isSubmitting}>Back</button>
          {!viewOnly && (
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : (formId ? "Update Form" : "Submit Form")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UG1Form;