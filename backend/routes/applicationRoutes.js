import express from "express";
import Application from "../models/Application.js";

const router = express.Router();

// POST to get all pending applications
router.post("/pending", async (req, res) => {
  try {
    const pendingApplications = await Application.find({ status: "pending" }).sort({ submitted: -1 });
    res.json(pendingApplications);
  } catch (error) {
    console.error("Error fetching pending applications:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST to get application details by ID
router.post("/getById", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Application ID is required" });

    const application = await Application.findById(id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    res.json(application);
  } catch (error) {
    console.error("Error fetching application by ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
