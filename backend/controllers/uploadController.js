import Upload from "../models/Upload.js"; // ✅ Fix import

export const uploadFiles = async (req, res) => {
  try {
    console.log("📌 Received Form Data:", req.body);
    console.log("📌 Uploaded Files:", req.files);

    const { svvNetId, projectTitle, studentDetails } = req.body;

    // Validate required fields
    if (!svvNetId) {
      console.error("❌ Error: SVVNet ID is missing in request body!");
      return res.status(400).json({ error: "SVVNet ID is required" });
    }

    if (!req.files || req.files.length === 0) {
      console.error("❌ Error: No PDF files uploaded!");
      return res.status(400).json({ error: "No PDF file uploaded!" });
    }

    const documentFiles = req.files.map(file => ({
      filename: file.originalname,
      url: `/uploads/${file.filename}`,
    }));

    const newUpload = new Upload({
      svvNetId,
      projectTitle,
      studentDetails: JSON.parse(studentDetails), // Ensure proper parsing
      documents: documentFiles,
    });

    await newUpload.save();
    res.status(201).json({ success: true, message: "Files uploaded successfully!" });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
