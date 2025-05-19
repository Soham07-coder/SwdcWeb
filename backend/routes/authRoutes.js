import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js"
dotenv.config(); // Load environment variables

const router = express.Router();

// 📌 **User Login Route**
router.post("/login", async (req, res) => {
    const { svvNetId, password } = req.body;

    console.log("📩 Received Login Request:", svvNetId, password);

    if (!svvNetId || !password) {
        return res.status(400).json({ message: "SVVNetID and password are required." });
    }

    try {
        const user = await User.findOne({ svvNetId });

        console.log("👤 User Found:", user);

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        // 📌 Direct password comparison (consider hashing for security)
        if (password !== user.password) {
            console.log("❌ Password Mismatch");
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // 📌 **Generate JWT Token**
        const token = jwt.sign(
            { svvNetId: user.svvNetId }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        console.log("✅ Login Successful, Token Generated");
        res.status(200).json({ message: "Login Successful", token });

    } catch (error) {
        console.error("❌ Server Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

export default router;
