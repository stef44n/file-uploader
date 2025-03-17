// const express = require("express");
// const upload = require("../middleware/uploadMiddleware");
// const prisma = require("../prismaClient"); // Make sure this is your Prisma instance
// const { ensureAuthenticated } = require("../middleware/authMiddleware"); // Protect route
import express from "express";
const router = express.Router();
import upload from "../middleware/uploadMiddleware.js";
import prisma from "../config/db.js";
import ensureAuthenticated from "../middleware/authMiddleware.js";

// File upload route
router.post(
    "/upload",
    ensureAuthenticated,
    upload.single("file"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            // Save file metadata to database
            const file = await prisma.file.create({
                data: {
                    name: req.file.filename,
                    originalName: req.file.originalname, // Store original filename
                    size: req.file.size,
                    mimetype: req.file.mimetype, // Store file type
                    path: req.file.path,
                    userId: req.user.id,
                    folderId: req.body.folderId || null, // Allow folder uploads
                },
            });

            res.json({ message: "File uploaded successfully", file });
        } catch (error) {
            console.error("File upload error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
);

export default router;
