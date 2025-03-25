import express from "express";
const router = express.Router();
import upload from "../middleware/uploadMiddleware.js";
import path from "path";
import prisma from "../config/db.js";
// import ensureAuthenticated from "../middleware/authMiddleware.js";
import fs from "fs";

router.get("/", async (req, res) => {
    try {
        const files = await prisma.file.findMany({
            where: { userId: req.user.id }, // Ensure it filters by logged-in user
        });
        res.json(files);
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).json({ message: "Error retrieving files" });
    }
});

// File upload route
router.post("/upload", upload.single("file"), async (req, res) => {
    const { folderId } = req.body; // Get folder ID from request body
    const userId = req.user?.id; // Assuming authentication middleware sets req.user

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const newFile = await prisma.file.create({
            data: {
                name: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                path: req.file.path,
                userId: userId,
                folderId: folderId || null, // Can be null if no folder is selected
            },
        });

        res.status(201).json(newFile);
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// File download route
router.get("/download/:id", async (req, res) => {
    try {
        const file = await prisma.file.findUnique({
            where: { id: req.params.id },
        });

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        const filePath = path.join(process.cwd(), file.path);
        // console.log(filePath);
        res.download(filePath, file.originalName);
    } catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE /api/files/:id - Delete a file
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Find file in DB
        const file = await prisma.file.findUnique({ where: { id } });
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        // Get full file path
        const filePath = path.join(process.cwd(), "uploads", file.path);

        // Delete file from filesystem
        fs.unlink(filePath, async (err) => {
            if (err && err.code !== "ENOENT") {
                console.error("Error deleting file:", err);
                return res
                    .status(500)
                    .json({ message: "Failed to delete file" });
            }

            // Delete file record from DB
            await prisma.file.delete({ where: { id } });

            res.json({ message: "File deleted successfully" });
        });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
