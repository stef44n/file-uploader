import express from "express";
const router = express.Router();
import upload from "../middleware/uploadMiddleware.js";
import prisma from "../config/db.js";
import cloudinary from "../utils/cloudinary.js";
import { Readable } from "stream";
import verifyToken from "../middleware/verifyToken.js";

// Get all user files
router.get("/", async (req, res) => {
    try {
        const files = await prisma.file.findMany({
            where: { userId: req.user.id },
        });
        res.json(files);
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).json({ message: "Error retrieving files" });
    }
});

// Upload to Cloudinary
router.post("/upload", upload.single("file"), async (req, res) => {
    const { folderId } = req.body;
    const userId = req.user?.id;

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const bufferStream = Readable.from(req.file.buffer);

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: "file-uploader",
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            bufferStream.pipe(stream);
        });

        const newFile = await prisma.file.create({
            data: {
                name: uploadResult.public_id,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                url: uploadResult.secure_url,
                userId,
                folderId: folderId || null,
            },
        });

        res.status(201).json(newFile);
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Upload failed" });
    }
});

// "Download" file route: just redirect or provide URL
router.get("/download/:id", async (req, res) => {
    try {
        const file = await prisma.file.findUnique({
            where: { id: req.params.id },
        });

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        res.redirect(file.url); // Or return the URL instead
    } catch (error) {
        console.error("Redirect error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Move file to folder
router.put("/:fileId/move", async (req, res) => {
    const { fileId } = req.params;
    const { newFolderId } = req.body;

    try {
        const updatedFile = await prisma.file.update({
            where: { id: fileId },
            data: { folderId: newFolderId || null },
        });

        res.json(updatedFile);
    } catch (error) {
        console.error("Error moving file:", error);
        res.status(500).json({ message: "Error moving file" });
    }
});

// File details
router.get("/:fileId/details", async (req, res) => {
    try {
        const file = await prisma.file.findUnique({
            where: { id: req.params.fileId },
        });

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        res.json({
            id: file.id,
            name: file.name,
            size: file.size,
            mimetype: file.mimetype,
            uploadTime: file.createdAt,
            url: file.url,
        });
    } catch (error) {
        console.error("Error fetching file details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete file from Cloudinary and DB
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const file = await prisma.file.findUnique({ where: { id } });
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(file.name, {
            resource_type: "image", // or "auto" if you're supporting different types
        });

        // Delete from database
        await prisma.file.delete({ where: { id } });

        res.json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get unsorted files (no folderId)
router.get("/unsorted", verifyToken, async (req, res) => {
    try {
        const unsortedFiles = await prisma.file.findMany({
            where: {
                folderId: null,
                userId: req.user.id, // ◀– filter by the logged-in user
            },
        });
        res.json(unsortedFiles);
    } catch (error) {
        console.error(
            "Error fetching unsorted files for user",
            req.user?.id,
            error
        );
        res.status(500).json({ message: "Failed to fetch unsorted files" });
    }
});

export default router;
