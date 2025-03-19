import express from "express";
const router = express.Router();
import upload from "../middleware/uploadMiddleware.js";
import path from "path";
import prisma from "../config/db.js";
import ensureAuthenticated from "../middleware/authMiddleware.js";

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

export default router;
